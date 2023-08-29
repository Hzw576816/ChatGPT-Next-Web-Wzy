import { getClientConfig } from "../config/client";
import { SubmitKey } from "../store/config";
import { LocaleType } from "./index";

// if you are adding a new translation, please use PartialLocaleType instead of LocaleType

const isApp = !!getClientConfig()?.isApp;
const en: LocaleType = {
  WIP: "Coming Soon...",
  Error: {
    Unauthorized: isApp
      ? "Invalid API Key, please check it in [Settings](/#/settings) page."
      : "Unauthorized access, please enter access code in [auth](/#/auth) page, or enter your OpenAI API Key.",
    Login: "您已登录，请点击下方「重试」按钮",
    Exception: "请求异常，请点击下方「重试」按钮",
  },
  PricingPage: {
    Title: "购买套餐",
    SubTitle: "畅享与AI聊天的乐趣",
    Actions: {
      Close: "关闭",
      Buy: " 购 买 ",
      Order: "订单中心",
      RedeemCode: "兑换码",
    },
    NoPackage: "暂无可用套餐",
    Loading: "请稍候……",
    PleaseLogin: "请先登录",
    ConsultAdministrator: "请咨询站长",
    BuyFailedCause: "套餐购买失败！原因：",
    TOO_FREQUENCILY: "操作过于频繁，请稍后再试",
    CREATE_ORDER_FAILED: "创建订单失败",
  },
  PayPage: {
    PaidSuccess: "支付成功",
    Actions: {
      Close: "关闭",
    },
  },
  BalancePage: {
    Title: "已购套餐",
    NoBalance: "您尚未购买任何套餐",
    Loading: "请稍候……",
    Actions: {
      Close: "关闭",
      Pricing: "购买套餐",
      Order: "订单中心",
      Profile: "个人中心",
      Refresh: "刷新",
      Refreshing: "刷新中……",
      RedeemCode: "兑换码",
    },
  },
  OrderPage: {
    Title: "订单中心",
    NoOrder: "暂无订单",
    Loading: "请稍候……",
    StateError: "状态错误！",
    CancelFailedForStateError: "当前状态下无法取消",
    CancelSuccess: "订单取消成功",
    CancelFailure: "订单取消失败",
    TryAgainLaster: "操作失败，请稍候重试",
    PleaseWaitForDataSync:
      "数据可能延迟，支付成功请在10分钟后查看订单状态，请勿重复支付",
    Actions: {
      Pay: "支付",
      Cancel: "取消",
      Pricing: "购买套餐",
      Profile: "个人中心",
      Copy: "复制",
      Refresh: "刷新",
      Refreshing: "刷新中……",
    },
  },
  Profile: {
    Title: "个人中心",
    SubTitle: "个人中心",
    AccountName: "账号",
    Username: "微信名",
    Email: "邮箱",
    Phone: "手机号",
    RegisterTime: "注册时间",
    InviteCode: {
      Title: "邀请码(选填)",
      TitleRequired: "邀请码(必填)",
      Placeholder: "输入邀请码获得额外权益",
    },
    Tokens: {
      Title: "tokens",
      SubTitle: "tokens数量",
    },
    ChatCount: {
      Title: "询问次数",
      SubTitle: "询问次数（GPT3.5等）",
    },
    AdvanceChatCount: {
      Title: "询问次数（GPT4）",
      SubTitle: "询问次数（GPT4）",
    },
    DrawCount: {
      Title: "绘图次数",
      SubTitle: "绘图次数",
    },
    Actions: {
      Close: "关闭",
      Pricing: "购买套餐",
      Order: "订单中心",
      GoToBalanceList: "更多",
      ConsultAdministrator: "请咨询站长",
      All: "所有套餐",
      CreateInviteCode: "生成邀请码",
      Copy: "复制链接",
      Redeem: "兑换码",
    },
    BalanceItem: {
      Title: "套餐类型",
      SubTitle: "",
      CalcTypes: {
        Total: "总额",
        Daily: "每天",
        Hourly: "每小时",
        ThreeHourly: "每3小时",
      },
    },
    ExpireList: {
      Title: "到期时间",
      SubTitle: "",
    },
  },
  LoginPage: {
    Title: "登录",
    SubTitle: "登录后可跟AI交流",
    Username: {
      Title: "用户名或邮箱",
      SubTitle: "",
      Placeholder: "请输入用户名或邮箱",
    },
    Password: {
      Title: "密码",
      SubTitle: "",
      Placeholder: "请输入密码",
    },
    Actions: {
      Close: "关闭",
      Login: "登录",
      Logout: "退出登录",
    },
    Toast: {
      Success: "登录成功",
      Logining: "登录中……",
      EmptyUserName: "用户名不能为空",
      EmptyPassword: "密码不能为空！",
    },
    GoToRegister: "前往注册",
    ForgetPassword: "忘记/重置密码",
  },
  Error_del: {
    Unauthorized: isApp
      ? "检测到无效 API Key，请前往[设置](/#/settings)页检查 API Key 是否配置正确。"
      : "访问密码不正确或为空，请前往[登录](/#/auth)页输入正确的访问密码，或者在[设置](/#/settings)页填入你自己的 OpenAI API Key。",
  },
  Auth: {
    Title: "Need Access Code",
    Tips: "Please enter access code below",
    Input: "access code",
    Confirm: "Confirm",
    Later: "Later",
  },
  ChatItem: {
    ChatItemCount: (count: number) => `${count} messages`,
  },
  Chat: {
    SubTitle: (count: number) => `${count} messages`,
    EditMessage: {
      Title: "Edit All Messages",
      Topic: {
        Title: "Topic",
        SubTitle: "Change the current topic",
      },
    },
    Actions: {
      ChatList: "Go To Chat List",
      CompressedHistory: "Compressed History Memory Prompt",
      Export: "Export All Messages as Markdown",
      Copy: "Copy",
      Stop: "Stop",
      Retry: "Retry",
      Pin: "Pin",
      PinToastContent: "Pinned 1 messages to contextual prompts",
      PinToastAction: "View",
      Delete: "Delete",
      Edit: "Edit",
    },
    Commands: {
      new: "Start a new chat",
      newm: "Start a new chat with mask",
      next: "Next Chat",
      prev: "Previous Chat",
      clear: "Clear Context",
      del: "Delete Chat",
    },
    InputActions: {
      Stop: "Stop",
      ToBottom: "To Latest",
      Theme: {
        auto: "Auto",
        light: "Light Theme",
        dark: "Dark Theme",
      },
      Prompt: "Prompts",
      Masks: "Masks",
      Clear: "Clear Context",
      Settings: "Settings",
    },
    Rename: "Rename Chat",
    Typing: "Typing…",
    Input: (submitKey: string) => {
      var inputHints = `${submitKey} to send`;
      if (submitKey === String(SubmitKey.Enter)) {
        inputHints += ", Shift + Enter to wrap";
      }
      return inputHints + ", / to search prompts, : to use commands";
    },
    Send: "Send",
    Config: {
      Reset: "Reset to Default",
      SaveAs: "Save as Mask",
    },
    IsContext: "Contextual Prompt",
  },
  Export: {
    Title: "Export Messages",
    Copy: "Copy All",
    Download: "Download",
    MessageFromYou: "Message From You",
    MessageFromChatGPT: "Message From ChatGPT",
    Share: "Share to ShareGPT",
    Format: {
      Title: "Export Format",
      SubTitle: "Markdown or PNG Image",
    },
    IncludeContext: {
      Title: "Including Context",
      SubTitle: "Export context prompts in mask or not",
    },
    Steps: {
      Select: "Select",
      Preview: "Preview",
    },
    Image: {
      Toast: "Capturing Image...",
      Modal: "Long press or right click to save image",
    },
  },
  Select: {
    Search: "Search",
    All: "Select All",
    Latest: "Select Latest",
    Clear: "Clear",
  },
  Memory: {
    Title: "Memory Prompt",
    EmptyContent: "Nothing yet.",
    Send: "Send Memory",
    Copy: "Copy Memory",
    Reset: "Reset Session",
    ResetConfirm:
      "Resetting will clear the current conversation history and historical memory. Are you sure you want to reset?",
  },
  Home: {
    NewChat: "New Chat",
    DeleteChat: "Confirm to delete the selected conversation?",
    DeleteToast: "Chat Deleted",
    Revert: "Revert",
  },
  Settings: {
    Title: "Settings",
    SubTitle: "All Settings",
    Danger: {
      Reset: {
        Title: "Reset All Settings",
        SubTitle: "Reset all setting items to default",
        Action: "Reset",
        Confirm: "Confirm to reset all settings to default?",
      },
      Clear: {
        Title: "Clear All Data",
        SubTitle: "Clear all messages and settings",
        Action: "Clear",
        Confirm: "Confirm to clear all messages and settings?",
      },
    },
    Lang: {
      Name: "Language", // ATTENTION: if you wanna add a new translation, please do not translate this value, leave it as `Language`
      All: "All Languages",
    },
    Avatar: "Avatar",
    FontSize: {
      Title: "Font Size",
      SubTitle: "Adjust font size of chat content",
    },
    InjectSystemPrompts: {
      Title: "Inject System Prompts",
      SubTitle: "Inject a global system prompt for every request",
    },
    InputTemplate: {
      Title: "Input Template",
      SubTitle: "Newest message will be filled to this template",
    },

    Update: {
      Version: (x: string) => `Version: ${x}`,
      IsLatest: "Latest version",
      CheckUpdate: "Check Update",
      IsChecking: "Checking update...",
      FoundUpdate: (x: string) => `Found new version: ${x}`,
      GoToUpdate: "Update",
    },
    SendKey: "Send Key",
    Theme: "Theme",
    TightBorder: "Tight Border",
    SendPreviewBubble: {
      Title: "Send Preview Bubble",
      SubTitle: "Preview markdown in bubble",
    },
    AutoGenerateTitle: {
      Title: "Auto Generate Title",
      SubTitle: "Generate a suitable title based on the conversation content",
    },
    Mask: {
      Splash: {
        Title: "Mask Splash Screen",
        SubTitle: "Show a mask splash screen before starting new chat",
      },
      Builtin: {
        Title: "Hide Builtin Masks",
        SubTitle: "Hide builtin masks in mask list",
      },
    },
    Prompt: {
      Disable: {
        Title: "Disable auto-completion",
        SubTitle: "Input / to trigger auto-completion",
      },
      List: "Prompt List",
      ListCount: (builtin: number, custom: number) =>
        `${builtin} built-in, ${custom} user-defined`,
      Edit: "Edit",
      Modal: {
        Title: "Prompt List",
        Add: "Add One",
        Search: "Search Prompts",
      },
      EditModal: {
        Title: "Edit Prompt",
      },
    },
    HistoryCount: {
      Title: "Attached Messages Count",
      SubTitle: "Number of sent messages attached per request",
    },
    CompressThreshold: {
      Title: "History Compression Threshold",
      SubTitle:
        "Will compress if uncompressed messages length exceeds the value",
    },
    Token: {
      Title: "API Key",
      SubTitle: "Use your key to ignore access code limit",
      Placeholder: "OpenAI API Key",
    },
    Usage: {
      Title: "Account Balance",
      SubTitle(used: any, total: any) {
        return `Used this month $${used}, subscription $${total}`;
      },
      IsChecking: "Checking...",
      Check: "Check",
      NoAccess: "Enter API Key to check balance",
    },
    AccessCode: {
      Title: "Access Code",
      SubTitle: "Access control enabled",
      Placeholder: "Need Access Code",
    },
    Endpoint: {
      Title: "Endpoint",
      SubTitle: "Custom endpoint must start with http(s)://",
    },
    CustomModel: {
      Title: "Custom Models",
      SubTitle: "Add extra model options, separate by comma",
    },
    Model: "Model",
    Temperature: {
      Title: "Temperature",
      SubTitle: "A larger value makes the more random output",
    },
    TopP: {
      Title: "Top P",
      SubTitle: "Do not alter this value together with temperature",
    },
    MaxTokens: {
      Title: "Max Tokens",
      SubTitle: "Maximum length of input tokens and generated tokens",
    },
    PresencePenalty: {
      Title: "Presence Penalty",
      SubTitle:
        "A larger value increases the likelihood to talk about new topics",
    },
    FrequencyPenalty: {
      Title: "Frequency Penalty",
      SubTitle:
        "A larger value decreasing the likelihood to repeat the same line",
    },
  },
  Store: {
    DefaultTopic: "New Conversation",
    BotHello: "Hello! How can I assist you today?",
    Error: "Something went wrong, please try again later.",
    Prompt: {
      History: (content: string) =>
        "This is a summary of the chat history as a recap: " + content,
      Topic:
        "Please generate a four to five word title summarizing our conversation without any lead-in, punctuation, quotation marks, periods, symbols, or additional text. Remove enclosing quotation marks.",
      Summarize:
        "Summarize the discussion briefly in 200 words or less to use as a prompt for future context.",
    },
  },
  Copy: {
    Success: "Copied to clipboard",
    Failed: "Copy failed, please grant permission to access clipboard",
  },
  Context: {
    Toast: (x: any) => `With ${x} contextual prompts`,
    Edit: "Current Chat Settings",
    Add: "Add a Prompt",
    Clear: "Context Cleared",
    Revert: "Revert",
  },
  Plugin: {
    Name: "Plugin",
  },
  Mask: {
    Name: "Mask",
    Page: {
      Title: "Prompt Template",
      SubTitle: (count: number) => `${count} prompt templates`,
      Search: "Search Templates",
      Create: "Create",
    },
    Item: {
      Info: (count: number) => `${count} prompts`,
      Chat: "Chat",
      View: "View",
      Edit: "Edit",
      Delete: "Delete",
      DeleteConfirm: "Confirm to delete?",
    },
    EditModal: {
      Title: (readonly: boolean) =>
        `Edit Prompt Template ${readonly ? "(readonly)" : ""}`,
      Download: "Download",
      Clone: "Clone",
    },
    Config: {
      Avatar: "Bot Avatar",
      Name: "Bot Name",
      Sync: {
        Title: "Use Global Config",
        SubTitle: "Use global config in this chat",
        Confirm: "Confirm to override custom config with global config?",
      },
      HideContext: {
        Title: "Hide Context Prompts",
        SubTitle: "Do not show in-context prompts in chat",
      },
      Share: {
        Title: "Share This Mask",
        SubTitle: "Generate a link to this mask",
        Action: "Copy Link",
      },
    },
  },
  NewChat: {
    Return: "Return",
    Skip: "Just Start",
    Title: "Pick a Mask",
    SubTitle: "Chat with the Soul behind the Mask",
    More: "Find More",
    NotShow: "Never Show Again",
    ConfirmNoShow: "Confirm to disable？You can enable it in settings later.",
  },

  UI: {
    Confirm: "Confirm",
    Cancel: "Cancel",
    Close: "Close",
    Create: "Create",
    Edit: "Edit",
  },
  Exporter: {
    Model: "Model",
    Messages: "Messages",
    Topic: "Topic",
    Time: "Time",
  },

  URLCommand: {
    Code: "Detected access code from url, confirm to apply? ",
    Settings: "Detected settings from url, confirm to apply?",
  },
};

export default en;
