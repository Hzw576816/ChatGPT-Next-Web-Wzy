import { appid as wxAppId, redirectUrl, wxAuthUrl } from "@/app/utils/wechat";

export function wxAuth(to: any = {}) {
  try {
    const appid = wxAppId;
    const fromName = to.name;
    let query = JSON.parse(JSON.stringify(to?.query || "{}"));
    let urlParams = new URLSearchParams(query);
    const baseUrl = `${redirectUrl}?${urlParams.toString()}`;
    const enCodeUrl = encodeURIComponent(baseUrl);
    console.log(wxAuthUrl(appid, `${enCodeUrl}`));
    // if (process.env.NODE_ENV !== "development") {
    location.replace(wxAuthUrl(appid, `${enCodeUrl}`));
    // }
  } catch (e) {
    console.error(`错误:${e}`);
  }
}
