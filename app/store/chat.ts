import { create } from "zustand";
import { persist } from "zustand/middleware";

import Locale, { getLang } from "../locales";

import { showToast } from "../components/ui-lib";
import { ModelConfig, ModelType, useAppConfig } from "./config";
import { createEmptyMask, Mask } from "./mask";
import {
  DEFAULT_INPUT_TEMPLATE,
  DEFAULT_SYSTEM_TEMPLATE,
  StoreKey,
} from "../constant";
import { api, RequestMessage } from "../client/api";
import { ChatControllerPool } from "../client/controller";
import { prettyObject } from "../utils/format";
import { estimateTokenLength } from "../utils/token";
import { nanoid } from "nanoid";
import {
  CallResult,
  requestGetMessages,
  requestGetOwnSession,
  requestNewOrUpdateSession,
  requestRemoveSession,
  requestRevokeSession,
} from "../requests";

export type ChatMessage = RequestMessage & {
  date: string | undefined;
  streaming?: boolean;
  isError?: boolean;
  id: string;
  model?: ModelType;
};

export function createMessage(override: Partial<ChatMessage>): ChatMessage {
  return {
    id: nanoid(),
    date: new Date().toLocaleString(),
    role: "user",
    content: "",
    ...override,
  };
}

export interface ChatStat {
  tokenCount: number;
  wordCount: number;
  charCount: number;
}

export interface ChatSession {
  id: string;
  topic: string;

  memoryPrompt: string;
  messages: ChatMessage[];
  stat: ChatStat;
  lastUpdate: string | undefined;
  lastSummarizeIndex: number;
  clearContextIndex?: number;

  mask: Mask;
}

export const DEFAULT_TOPIC = Locale.Store.DefaultTopic;
export const BOT_HELLO: ChatMessage = createMessage({
  role: "assistant",
  content: Locale.Store.BotHello,
});

function createEmptySession(): ChatSession {
  return {
    id: nanoid(),
    topic: DEFAULT_TOPIC,
    memoryPrompt: "",
    messages: [],
    stat: {
      tokenCount: 0,
      wordCount: 0,
      charCount: 0,
    },
    lastUpdate: new Date().toLocaleString(),
    lastSummarizeIndex: 0,

    mask: createEmptyMask(),
  };
}

interface ChatStore {
  sessions: ChatSession[];
  chatLoading: boolean;
  currentSessionIndex: number;
  unauthorized: (result: CallResult) => void;
  getOwnSession: () => Promise<void>;
  getMessages: () => Promise<void>;
  clearSessions: () => void;
  moveSession: (from: number, to: number) => void;
  selectSession: (index: number) => void;
  newSession: (mask?: Mask) => Promise<void>;
  deleteSession: (index: number) => void;
  currentSession: () => ChatSession;
  nextSession: (delta: number) => void;
  onNewMessage: (message: ChatMessage) => void;
  onUserInput: (content: string) => Promise<void>;
  summarizeSession: () => void;
  updateStat: (message: ChatMessage) => void;
  updateCurrentSession: (updater: (session: ChatSession) => void) => void;
  updateMessage: (
    sessionIndex: number,
    messageIndex: number,
    updater: (message?: ChatMessage) => void,
  ) => void;
  resetSession: () => void;
  getMessagesWithMemory: () => ChatMessage[];
  getMemoryPrompt: () => ChatMessage;

  clearAllData: () => void;
}

function countMessages(msgs: ChatMessage[]) {
  return msgs.reduce((pre, cur) => pre + estimateTokenLength(cur.content), 0);
}

function fillTemplateWith(input: string, modelConfig: ModelConfig) {
  const vars = {
    model: modelConfig.model,
    time: new Date().toLocaleString(),
    lang: getLang(),
    input: input,
  };

  let output = modelConfig.template ?? DEFAULT_INPUT_TEMPLATE;

  // must contains {{input}}
  const inputVar = "{{input}}";
  if (!output.includes(inputVar)) {
    output += "\n" + inputVar;
  }

  Object.entries(vars).forEach(([name, value]) => {
    output = output.replaceAll(`{{${name}}}`, value);
  });

  return output;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      chatLoading: true,
      unauthorized(result: CallResult) {
        if (result.code === 401) {
          set((state) => ({
            currentSessionIndex: 0,
            chatLoading: false,
          }));
        }
      },
      sessions: [createEmptySession()],
      currentSessionIndex: 0,
      async getOwnSession() {
        set((state) => ({
          chatLoading: true,
        }));
        let result: CallResult = await requestGetOwnSession();
        if (result.code === 0) {
          if (result.data.length > 0) {
            set((state) => ({
              currentSessionIndex: 0,
              chatLoading: false,
              sessions: result.data as ChatSession[],
            }));
          } else {
            await get().newSession();
            await get().getOwnSession();
          }
        }

        get().unauthorized(result);
      },
      async getMessages() {
        const currentSession = get().currentSession();
        let result: CallResult = await requestGetMessages(currentSession.id);
        if (result.code === 0) {
          get().updateCurrentSession((session) => {
            session.messages = result.data.items;
          });

          set((state) => ({
            chatLoading: false,
          }));
        }
        get().unauthorized(result);
      },
      clearSessions() {
        set(() => ({
          sessions: [createEmptySession()],
          currentSessionIndex: 0,
        }));
      },

      selectSession(index: number) {
        set({
          currentSessionIndex: index,
          chatLoading: true,
        });
        get()
          .getMessages()
          .finally(() => {});
      },

      moveSession(from: number, to: number) {
        set((state) => {
          const { sessions, currentSessionIndex: oldIndex } = state;

          // move the session
          const newSessions = [...sessions];
          const session = newSessions[from];
          newSessions.splice(from, 1);
          newSessions.splice(to, 0, session);

          // modify current session id
          let newIndex = oldIndex === from ? to : oldIndex;
          if (oldIndex > from && oldIndex <= to) {
            newIndex -= 1;
          } else if (oldIndex < from && oldIndex >= to) {
            newIndex += 1;
          }

          return {
            currentSessionIndex: newIndex,
            sessions: newSessions,
          };
        });
      },

      async newSession(mask) {
        const session = createEmptySession();

        if (mask) {
          const config = useAppConfig.getState();
          const globalModelConfig = config.modelConfig;

          session.mask = {
            ...mask,
            modelConfig: {
              ...globalModelConfig,
              ...mask.modelConfig,
            },
          };
          session.topic = mask.name;
        }
        let result: any = await requestNewOrUpdateSession(
          session.topic,
          session.mask,
        );
        if (result.code === 0) {
          session.id = result.data;
        }
        set((state) => ({
          currentSessionIndex: 0,
          sessions: [session].concat(state.sessions),
        }));
      },

      nextSession(delta) {
        const n = get().sessions.length;
        const limit = (x: number) => (x + n) % n;
        const i = get().currentSessionIndex;
        get().selectSession(limit(i + delta));
      },

      async deleteSession(index) {
        const deletingLastSession = get().sessions.length === 1;
        const deletedSession = get().sessions.at(index);

        if (!deletedSession) return;

        set(() => ({
          chatLoading: true,
        }));

        await requestRemoveSession(deletedSession.id);
        //如果是最后一个被移除后,就需要重新建一个
        if (deletingLastSession) {
          await get().newSession();
        }

        // const sessions = get().sessions.slice();
        // sessions.splice(index, 1);
        //
        // const currentIndex = get().currentSessionIndex;
        // let nextIndex = Math.min(
        //     currentIndex - Number(index < currentIndex),
        //     sessions.length - 1,
        // );
        //
        // if (deletingLastSession) {
        //     nextIndex = 0;
        //     set(() => ({
        //         chatLoading: true,
        //     }));
        //     await get().newSession();
        //     // sessions.push(createEmptySession());
        // }

        // for undo delete action 撤销
        const restoreState = {
          currentSessionIndex: get().currentSessionIndex,
          sessions: get().sessions.slice(),
        };

        // set(() => ({
        //     currentSessionIndex: nextIndex,
        //     sessions,
        // }));

        await get().getOwnSession();

        showToast(
          Locale.Home.DeleteToast,
          {
            text: Locale.Home.Revert,
            onClick() {
              requestRevokeSession(deletedSession.id).finally(() => {
                get().getOwnSession();
              });
            },
          },
          5000,
        );
      },

      currentSession() {
        let index = get().currentSessionIndex;
        const sessions = get().sessions;

        if (index < 0 || index >= sessions.length) {
          index = Math.min(sessions.length - 1, Math.max(0, index));
          set(() => ({ currentSessionIndex: index }));
        }

        const session = sessions[index];
        return session;
      },

      onNewMessage(message) {
        get().updateCurrentSession((session) => {
          session.messages = session.messages.concat();
          session.lastUpdate = new Date().toLocaleString();
        });
        get().updateStat(message);
        get().summarizeSession();
      },

      async onUserInput(content) {
        const session = get().currentSession();

        const modelConfig = session.mask.modelConfig;

        const userContent = fillTemplateWith(content, modelConfig);
        console.log("[User Input] after template: ", userContent);

        const userMessage: ChatMessage = createMessage({
          role: "user",
          content: userContent,
        });

        const botMessage: ChatMessage = createMessage({
          role: "assistant",
          streaming: true,
          model: modelConfig.model,
        });

        // get recent messages
        const recentMessages = get().getMessagesWithMemory();
        const sendMessages = recentMessages.concat(userMessage);
        const messageIndex = get().currentSession().messages.length + 1;

        // save user's and bot's message
        get().updateCurrentSession((session) => {
          const savedUserMessage = {
            ...userMessage,
            content,
          };
          session.messages = session.messages.concat([
            savedUserMessage,
            botMessage,
          ]);
        });
        // make request
        //这里不能加await 会导致loading异常 2023.0825
        api.llm.chat({
          messages: sendMessages,
          config: { ...modelConfig, stream: true, chatId: session.id },
          onUpdate(message) {
            botMessage.streaming = true;
            if (message) {
              botMessage.content = message;
            }
            get().updateCurrentSession((session) => {
              session.messages = session.messages.concat();
            });
          },
          onFinish(message) {
            botMessage.streaming = false;
            if (message) {
              botMessage.content = message;
              get().onNewMessage(botMessage);
            }
            ChatControllerPool.remove(session.id, botMessage.id);
          },
          onError(error) {
            const isAborted = error.message.includes("aborted");
            botMessage.content +=
              "\n\n" +
              prettyObject({
                error: true,
                message: error.message,
              });
            botMessage.streaming = false;
            userMessage.isError = !isAborted;
            botMessage.isError = !isAborted;
            get().updateCurrentSession((session) => {
              session.messages = session.messages.concat();
            });
            ChatControllerPool.remove(
              session.id,
              botMessage.id ?? messageIndex,
            );

            console.error("[Chat] failed ", error);
          },
          onController(controller) {
            // collect controller for stop/retry
            ChatControllerPool.addController(
              session.id,
              botMessage.id ?? messageIndex,
              controller,
            );
          },
        });
      },

      getMemoryPrompt() {
        const session = get().currentSession();

        return {
          role: "system",
          content:
            session.memoryPrompt.length > 0
              ? Locale.Store.Prompt.History(session.memoryPrompt)
              : "",
          date: "",
        } as ChatMessage;
      },

      getMessagesWithMemory() {
        const session = get().currentSession();
        const modelConfig = session.mask.modelConfig;
        const clearContextIndex = session.clearContextIndex ?? 0;
        const messages = session.messages.slice();
        const totalMessageCount = session.messages.length;

        // in-context prompts
        const contextPrompts = session.mask.context.slice();

        //TODO 这里不要加
        // system prompts, to get close to OpenAI Web ChatGPT
        const shouldInjectSystemPrompts = false; //modelConfig.enableInjectSystemPrompts;
        const systemPrompts = shouldInjectSystemPrompts
          ? [
              createMessage({
                role: "system",
                content: fillTemplateWith("", {
                  ...modelConfig,
                  template: DEFAULT_SYSTEM_TEMPLATE,
                }),
              }),
            ]
          : [];
        if (shouldInjectSystemPrompts) {
          console.log(
            "[Global System Prompt] ",
            systemPrompts.at(0)?.content ?? "empty",
          );
        }

        // long term memory
        const shouldSendLongTermMemory =
          modelConfig.sendMemory &&
          session.memoryPrompt &&
          session.memoryPrompt.length > 0 &&
          session.lastSummarizeIndex > clearContextIndex;
        const longTermMemoryPrompts = shouldSendLongTermMemory
          ? [get().getMemoryPrompt()]
          : [];
        const longTermMemoryStartIndex = session.lastSummarizeIndex;

        // short term memory
        const shortTermMemoryStartIndex = Math.max(
          0,
          totalMessageCount - modelConfig.historyMessageCount,
        );

        // lets concat send messages, including 4 parts:
        // 0. system prompt: to get close to OpenAI Web ChatGPT
        // 1. long term memory: summarized memory messages
        // 2. pre-defined in-context prompts
        // 3. short term memory: latest n messages
        // 4. newest input message
        const memoryStartIndex = shouldSendLongTermMemory
          ? Math.min(longTermMemoryStartIndex, shortTermMemoryStartIndex)
          : shortTermMemoryStartIndex;
        // and if user has cleared history messages, we should exclude the memory too.
        const contextStartIndex = Math.max(clearContextIndex, memoryStartIndex);
        const maxTokenThreshold = modelConfig.max_tokens;

        // get recent messages as much as possible
        const reversedRecentMessages = [];
        for (
          let i = totalMessageCount - 1, tokenCount = 0;
          i >= contextStartIndex && tokenCount < maxTokenThreshold;
          i -= 1
        ) {
          const msg = messages[i];
          if (!msg || msg.isError) continue;
          tokenCount += estimateTokenLength(msg.content);
          reversedRecentMessages.push(msg);
        }

        // concat all messages
        const recentMessages = [
          ...systemPrompts,
          ...longTermMemoryPrompts,
          ...contextPrompts,
          ...reversedRecentMessages.reverse(),
        ];

        return recentMessages;
      },

      updateMessage(
        sessionIndex: number,
        messageIndex: number,
        updater: (message?: ChatMessage) => void,
      ) {
        const sessions = get().sessions;
        const session = sessions.at(sessionIndex);
        const messages = session?.messages;
        updater(messages?.at(messageIndex));
        set(() => ({ sessions }));
      },

      resetSession() {
        get().updateCurrentSession((session) => {
          session.messages = [];
          session.memoryPrompt = "";
        });
      },

      summarizeSession() {
        const config = useAppConfig.getState();
        const session = get().currentSession();

        // remove error messages if any
        const messages = session.messages;

        // should summarize topic after chating more than 50 words
        const SUMMARIZE_MIN_LEN = 50;

        // todo  这里注释 20230822 多请求一次是为了做啥的
        // if (
        //     config.enableAutoGenerateTitle &&
        //     session.topic === DEFAULT_TOPIC &&
        //     countMessages(messages) >= SUMMARIZE_MIN_LEN
        // ) {
        //   const topicMessages = messages.concat(
        //       createMessage({
        //         role: "user",
        //         content: Locale.Store.Prompt.Topic,
        //       }),
        //   );
        //   api.llm.chat({
        //     messages: topicMessages,
        //     config: {
        //       model: "gpt-3.5-turbo",
        //     },
        //     onFinish(message) {
        //       get().updateCurrentSession(
        //           (session) =>
        //               (session.topic =
        //                   message.length > 0 ? trimTopic(message) : DEFAULT_TOPIC),
        //       );
        //     },
        //   });
        // }

        const modelConfig = session.mask.modelConfig;
        const summarizeIndex = Math.max(
          session.lastSummarizeIndex,
          session.clearContextIndex ?? 0,
        );
        let toBeSummarizedMsgs = messages
          .filter((msg) => !msg.isError)
          .slice(summarizeIndex);

        const historyMsgLength = countMessages(toBeSummarizedMsgs);

        if (historyMsgLength > modelConfig?.max_tokens ?? 4000) {
          const n = toBeSummarizedMsgs.length;
          toBeSummarizedMsgs = toBeSummarizedMsgs.slice(
            Math.max(0, n - modelConfig.historyMessageCount),
          );
        }

        // add memory prompt
        toBeSummarizedMsgs.unshift(get().getMemoryPrompt());

        const lastSummarizeIndex = session.messages.length;

        console.log(
          "[Chat History] ",
          toBeSummarizedMsgs,
          historyMsgLength,
          modelConfig.compressMessageLengthThreshold,
        );

        if (
          historyMsgLength > modelConfig.compressMessageLengthThreshold &&
          modelConfig.sendMemory
        ) {
          // todo 这里是历史上下文汇总
          // api.llm.chat({
          //   messages: toBeSummarizedMsgs.concat(
          //     createMessage({
          //       role: "system",
          //       content: Locale.Store.Prompt.Summarize,
          //       date: "",
          //     }),
          //   ),
          //   config: {
          //     ...modelConfig,
          //     stream: true,
          //     model: "gpt-3.5-turbo",
          //     chatId: session.id,
          //   },
          //   onUpdate(message) {
          //     session.memoryPrompt = message;
          //   },
          //   onFinish(message) {
          //     console.log("[Memory] ", message);
          //     session.lastSummarizeIndex = lastSummarizeIndex;
          //   },
          //   onError(err) {
          //     console.error("[Summarize] ", err);
          //   },
          // });
        }
      },

      updateStat(message) {
        get().updateCurrentSession((session) => {
          session.stat.charCount += message.content.length;
          // TODO: should update chat count and word count
        });
      },

      updateCurrentSession(updater) {
        const sessions = get().sessions;
        const index = get().currentSessionIndex;
        updater(sessions[index]);
        set(() => ({ sessions }));
      },

      clearAllData() {
        localStorage.clear();
        location.reload();
      },
    }),
    {
      name: StoreKey.Chat,
      version: 3.1,
      migrate(persistedState, version) {
        const state = persistedState as any;
        const newState = JSON.parse(JSON.stringify(state)) as ChatStore;
        if (version < 2) {
          newState.sessions = [];

          const oldSessions = state.sessions;
          for (const oldSession of oldSessions) {
            const newSession = createEmptySession();
            newSession.topic = oldSession.topic;
            newSession.messages = [...oldSession.messages];
            newSession.mask.modelConfig.sendMemory = true;
            newSession.mask.modelConfig.historyMessageCount = 4;
            newSession.mask.modelConfig.compressMessageLengthThreshold = 1000;
            newState.sessions.push(newSession);
          }
        }

        if (version < 3) {
          // migrate id to nanoid
          newState.sessions.forEach((s) => {
            s.id = nanoid();
            s.messages.forEach((m) => (m.id = nanoid()));
          });
        }

        // Enable `enableInjectSystemPrompts` attribute for old sessions.
        // Resolve issue of old sessions not automatically enabling.
        if (version < 3.1) {
          newState.sessions.forEach((s) => {
            if (
              // Exclude those already set by user
              !s.mask.modelConfig.hasOwnProperty("enableInjectSystemPrompts")
            ) {
              // Because users may have changed this configuration,
              // the user's current configuration is used instead of the default
              const config = useAppConfig.getState();
              s.mask.modelConfig.enableInjectSystemPrompts =
                config.modelConfig.enableInjectSystemPrompts;
            }
          });
        }

        return newState;
      },
    },
  ),
);
