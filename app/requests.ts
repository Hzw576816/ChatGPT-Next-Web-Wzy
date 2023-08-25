import type { Response } from "./api/common";
import { getHeaders } from "@/app/client/api";
import { Mask } from "@/app/store/mask";
import { useAuthStore } from "@/app/store";

export interface CallResult {
  code: number;
  message?: string;
  data?: any;
}

export async function request(
  url: string,
  method: string,
  body: any,
  options?: {
    onError: (error: Error) => void;
  },
): Promise<CallResult> {
  try {
    const BASE_URL = process.env.BASE_URL;
    const mode = process.env.BUILD_MODE;
    let requestUrl = (mode === "export" ? BASE_URL : "") + "/api" + url;

    const res = await fetch(requestUrl, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...getHeaders(),
      },
      body: body === null ? null : JSON.stringify(body),
      // // @ts-ignore
      // duplex: "half",
    });
    if (res.status === 401) {
      return {
        code: 401,
        message: "",
      };
    }
    let response = await res.json();
    if (res.status == 200) {
      let json: Response<any>;
      json = response as Response<any>;
      return {
        code: 0,
        data: json,
      };
    } else {
      options?.onError({
        name: "unknown error(1)",
        message: response.error.message,
      });
      return {
        code: -1,
        message: response.error.message,
      };
    }
  } catch (err) {
    options?.onError(err as Error);
    return {
      code: -1,
      message: "Error",
    };
  }
}

/**
 * 登录
 * @param username 用户名
 * @param password 密码
 * @param options
 */
export async function requestLogin(
  username: string,
  password: string,
  options?: {
    onError: (error: Error) => void;
  },
): Promise<CallResult> {
  return request(
    "/app/account/login",
    "POST",
    { name: username, password },
    options,
  );
}

/**
 * 创建修改聊天会话
 * @param name
 * @param id
 * @param mask
 */
export async function requestNewOrUpdateSession(
  name: string,
  mask: Mask,
  id?: string,
): Promise<CallResult> {
  return request("/app/v1/chat/create-chat-session", "POST", {
    id,
    topic: name,
    mask,
  });
}

/**
 * 获取聊天会话
 */
export async function requestGetOwnSession(): Promise<CallResult> {
  return request("/app/v1/chat/list-session", "POST", {});
}

/**
 * 获取会话消息记录
 * @param chatId
 */
export async function requestGetMessages(chatId: string): Promise<CallResult> {
  return request("/app/v1/chat/list-session-chat", "POST", { chatId });
}

/**
 * 移除会话
 * @param sessionId
 */
export async function requestRemoveSession(
  sessionId: string,
): Promise<CallResult> {
  return request("/app/v1/chat/remove-session", "POST", { id: sessionId });
}

/**
 * 撤销会话
 * @param sessionId
 */
export async function requestRevokeSession(
  sessionId: string,
): Promise<CallResult> {
  return request("/app/v1/chat/revoke-session", "POST", { id: sessionId });
}
