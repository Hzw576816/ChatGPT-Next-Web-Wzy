import type { Response } from "./api/common";
import { getHeaders } from "@/app/client/api";
import { Mask } from "@/app/store/mask";

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
    // res.text().then(ee=>{
    //     console.log(ee,res)
    // })
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
export async function requestMyComboRecordsApi(): Promise<CallResult> {
  return request(`/app/user/own-combo-records`, "POST", {});
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
