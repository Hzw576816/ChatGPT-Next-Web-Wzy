import type { Response } from "./api/common";
import { getHeaders } from "@/app/client/api";
import { Mask } from "@/app/store/mask";
import { getClientConfig } from "@/app/config/client";
import { DEFAULT_API_HOST } from "@/app/constant";
import authStore from "@/app/store/auth";
import { ChatSession } from "@/app/store";

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
    const isApp = !!getClientConfig()?.isApp;
    requestUrl = isApp ? DEFAULT_API_HOST + url : requestUrl;
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
      authStore.getState().logout();
      return {
        code: 401,
        message: "",
      };
    }

    let resText = await res.text();
    let response: any;
    try {
      response = JSON.parse(resText);
    } catch (e) {
      response = resText;
    }
    if (res.status == 200) {
      let json: Response<any>;
      json = response as Response<any>;
      return {
        code: 0,
        data: json,
      };
    } else {
      if (res.status == 204) {
        return {
          code: 0,
          message: "操作成功",
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
    }
  } catch (err) {
    console.log(err);
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

/**
 * 获取套餐
 */
export async function requestComboList(): Promise<CallResult> {
  return request("/app/user/list-memberShipType-visible", "POST", {});
}

/**
 * 购买套餐
 */
export async function requestPayComboApi(
  memberTypeId: string,
  reChargeId: string,
  tradeType: "JSAPI" | "NATIVE" | "APP" | "MWEB",
): Promise<CallResult> {
  return request("/app/user/pay-member", "POST", {
    memberTypeId,
    reChargeId,
    tradeType,
  });
}

/**
 * 根据订单号获取订单信息
 * @param orderNo
 */
export async function requestGetPayOrderApi(
  orderNo: string | null,
): Promise<CallResult> {
  return request(`/app/orders/get-order?orderNo=${orderNo}`, "POST", {});
}

/**
 * 检查支付状态
 * @param orderNo
 */
export async function requestCheckPayOrderPaidApi(
  orderNo: string | null,
): Promise<CallResult> {
  return request(`/app/orders/check-pay-status?orderNo=${orderNo}`, "POST", {});
}

/**
 * 获取订单列表
 */
export async function requestMyOrderApi(): Promise<CallResult> {
  return request(`/app/orders/list-recharge-orders`, "POST", {
    pageIndex: 1,
    pageSize: 2000,
  });
}

/**
 * 获取已购买套餐
 */
export async function requestMyComboRecordsApi(
  top?: boolean,
): Promise<CallResult> {
  return request(`/app/user/own-combo-records`, "POST", {
    top,
  });
}

/**
 * 移动端微信登录
 * @param temporaryCode
 * @param initiativeRegister
 */
export async function requestWxLoginApi(
  temporaryCode: string | null,
  initiativeRegister: boolean,
): Promise<CallResult> {
  return request(`/app/user/wx-login`, "POST", {
    temporaryCode,
    initiativeRegister,
  });
}

/**
 * 微信网页授权登录-生成扫码唯一码
 */
export async function requestGenerateScanCodeApi(): Promise<CallResult> {
  return request(`/app/user/generate-scan-code`, "POST", {});
}

/**
 * 微信网页授权登录-手机扫码后通知服务端并存储授权码
 * @param temporaryCode
 * @param qrCode
 */
export async function requestScanLoginSaveApi(
  temporaryCode: string,
  qrCode: string,
): Promise<CallResult> {
  return request(`/app/user/scan-login-save`, "POST", {
    temporaryCode,
    qrCode,
  });
}

/**
 * 微信网页授权登录-校验检查扫码状态
 * @param qrCode
 */
export async function requestCheckScanStatusApi(
  qrCode: string,
): Promise<CallResult> {
  return request(`/app/user/check-scan-status`, "POST", {
    qrCode,
  });
}

/**
 *
 * @param orderNo
 */
export async function requestPointToPayApi(
  orderNo: string,
): Promise<CallResult> {
  return request("/app/orders/point-to-pay", "POST", {
    orderNo,
  });
}

/**
 * 获取会员
 */
export async function requestGetMemberApi(): Promise<CallResult> {
  return request("/app/user/get-member", "POST", {});
}

/**
 * 修改聊天会话标题
 * @param session
 */
export async function requestUpdateSessionApi(
  session: ChatSession,
): Promise<CallResult> {
  return request("/app/v1/chat/update-session", "POST", { ...session });
}

/**
 * 获取用户设置
 */
export async function requestGetSettingApi(): Promise<CallResult> {
  return request("/app/user-setting/get", "POST", {});
}

/**
 * 设置用户配置
 * @param config
 */
export async function requestSetSettingApi(config: any): Promise<CallResult> {
  return request("/app/user-setting/set", "POST", { ...config });
}
