import type { Response } from "./api/common";
import { getHeaders } from "@/app/client/api";

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
    let response = await res.json();

    let json: Response<any>;
    if (res.status == 200) {
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
 * @param options
 */
export async function requestNewOrUpdateSession(
  name: string,
  id?: string,
): Promise<CallResult> {
  return request("/app/v1/chat/create-chat-session", "POST", { id, name });
}
