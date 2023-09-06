import { TransitScan } from "@/app/components/transit-scan";

export const OWNER = "Yidadaa";
export const REPO = "ChatGPT-Next-Web";
export const REPO_URL = `https://github.com/${OWNER}/${REPO}`;
export const ISSUE_URL = `https://github.com/${OWNER}/${REPO}/issues`;
export const UPDATE_URL = `${REPO_URL}#keep-updated`;
export const RELEASE_URL = `${REPO_URL}/releases`;
export const FETCH_COMMIT_URL = `https://api.github.com/repos/${OWNER}/${REPO}/commits?per_page=1`;
export const FETCH_TAG_URL = `https://api.github.com/repos/${OWNER}/${REPO}/tags?per_page=1`;
export const RUNTIME_CONFIG_DOM = "danger-runtime-config";
export const DEFAULT_API_HOST = "http://39.104.53.56:8015/api";

export enum Path {
  Home = "/",
  Chat = "/chat",
  Settings = "/settings",
  NewChat = "/new-chat",
  Masks = "/masks",
  Auth = "/auth",
  Login = "/login",
  Pricing = "/pricing",
  Order = "/order",
  Pay = "/pay",
  Profile = "/profile",
  Balance = "/balance",
  WxLogin = "/wxLogin",
  TransitScan = "/transit-scan",
}

export enum SlotID {
  AppBody = "app-body",
}

export enum FileName {
  Masks = "masks.json",
  Prompts = "prompts.json",
}

export enum StoreKey {
  Chat = "chat-next-web-store",
  Access = "access-control",
  Config = "app-config",
  Mask = "mask-store",
  Prompt = "prompt-store",
  Update = "chat-update",
  Sync = "sync",
  Auth = "auth",
  WebsiteConfig = "website-config",
  Profile = "profile",
}

export const MAX_SIDEBAR_WIDTH = 500;
export const MIN_SIDEBAR_WIDTH = 230;
export const NARROW_SIDEBAR_WIDTH = 100;

export const ACCESS_CODE_PREFIX = "nk-";

export const LAST_INPUT_KEY = "last-input";

export const REQUEST_TIMEOUT_MS = 60000;

export const EXPORT_MESSAGE_CLASS_NAME = "export-markdown";

export const OpenaiPath = {
  ChatPath: "v1/chat/completions",
  UsagePath: "dashboard/billing/usage",
  SubsPath: "dashboard/billing/subscription",
  ListModelPath: "v1/models",
};

export const DEFAULT_INPUT_TEMPLATE = `{{input}}`; // input / time / model / lang
export const DEFAULT_SYSTEM_TEMPLATE = `
You are ChatGPT, a large language model trained by OpenAI.
Knowledge cutoff: 2021-09
Current model: {{model}}
Current time: {{time}}`;

export const DEFAULT_MODELS = [
  {
    name: "gpt-4",
    available: true,
  },
  {
    name: "gpt-4-0314",
    available: true,
  },
  {
    name: "gpt-4-0613",
    available: true,
  },
  {
    name: "gpt-4-32k",
    available: true,
  },
  {
    name: "gpt-4-32k-0314",
    available: true,
  },
  {
    name: "gpt-4-32k-0613",
    available: true,
  },
  {
    name: "gpt-3.5-turbo",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-0301",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-0613",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-16k",
    available: true,
  },
  {
    name: "gpt-3.5-turbo-16k-0613",
    available: true,
  },
] as const;

export const CHAT_PAGE_SIZE = 15;
export const MAX_RENDER_MSG_COUNT = 45;
export const ServiceAgreement =
  "服务协议\n" +
  "\n" +
  "最后更新日期：[2023/09/05]\n" +
  "\n" +
  "1.接受条款\n" +
  "\n" +
  "使用[共享AI]提供的服务，表示您同意遵守以下条款和条件。如果您不同意这些条款，请不要使用我们的服务。\n" +
  "\n" +
  "2.服务描述\n" +
  "\n" +
  "[共享AI]提供用户与GPT AI交互的能力。用户可以提交查询，并获得AI的回复。\n" +
  "\n" +
  "3.使用政策\n" +
  "\n" +
  "用户不得利用服务进行违法、误导或恶意行为。我们保留在未经通知的情况下删除或修改任何内容的权利。\n" +
  "\n" +
  "4.服务的更改和终止\n" +
  "\n" +
  "我们保留随时更改、暂停或终止服务的权利，无论原因如何，而无需向用户通知。\n" +
  "\n" +
  "5.免责声明\n" +
  "\n" +
  "服务是按“原样”提供的，不提供任何明示或暗示的保证，包括但不限于对适销性、特定用途的适用性或非侵权性的保证。\n" +
  "\n" +
  "6.限制责任\n" +
  "\n" +
  "[共享AI]及其关联公司、员工和代理商对由于使用或无法使用服务而导致的任何直接、间接、特殊、偶然或后果性损害均不承担责任。\n" +
  "\n" +
  "7.隐私政策\n" +
  "\n" +
  "使用我们的服务也受我们的隐私政策的约束。\n" +
  "\n" +
  "8.修订\n" +
  "\n" +
  "我们可能会定期更新此服务协议。我们建议您定期查看以了解最新的服务条款。\n" +
  "\n" +
  "9.联系我们\n" +
  "\n" +
  "如果您有关于此服务协议的任何问题，请联系我们";
export const PrivacyAgreement =
  "隐私政策\n" +
  "\n" +
  "最后更新日期：[2023/09/05]\n" +
  "\n" +
  "1.介绍\n" +
  "\n" +
  "欢迎使用 [共享AI]（以下简称“我们”或“我们的”）。我们尊重您的隐私，致力于保护您的个人信息。请阅读以下隐私政策，了解我们是如何收集、使用和保护您的个人信息的。\n" +
  "\n" +
  "2.我们收集的信息\n" +
  "\n" +
  "为了提供我们的服务，我们可能会收集以下信息：\n" +
  "\n" +
  "用户名和密码\n" +
  "聊天记录和用户向GPT提出的查询\n" +
  "3.如何使用信息\n" +
  "\n" +
  "我们可能会使用您的信息来：\n" +
  "\n" +
  "提供、维护和改进我们的服务\n" +
  "为您提供客户支持\n" +
  "进行研究和分析，以改善我们的服务\n" +
  "4.信息的分享\n" +
  "\n" +
  "我们不会出售您的个人信息。但在以下情况下，我们可能会与第三方分享您的信息：\n" +
  "\n" +
  "为了遵守法律、法规、法律程序或政府要求；\n" +
  "为了执行合同、条款和政策；\n" +
  "为了保护我们、我们的用户或公众的权利、隐私、安全或财产。\n" +
  "5.数据保留\n" +
  "\n" +
  "我们只在为您提供服务所需的时间内保留您的个人信息，并在不再需要时删除这些信息。\n" +
  "\n" +
  "6.数据安全\n" +
  "\n" +
  "我们使用各种安全技术和程序来保护您的个人信息免受未经授权的访问、使用或披露。\n" +
  "\n" +
  "7.修改隐私政策\n" +
  "\n" +
  "我们可能会定期更新我们的隐私政策。任何更改都会在我们的网站上发布，我们建议您定期查看以了解最新的隐私政策。\n" +
  "\n" +
  "8.联系我们\n" +
  "\n" +
  "如果您有任何关于此隐私政策的问题，请联系我们";
