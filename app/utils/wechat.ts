export function isInWechat(): boolean {
  const agent = navigator.userAgent.toLowerCase();
  return agent.indexOf("micromessenger") != -1;
}

export function wxPayBridge(data: any) {
  return new Promise((resolve, reject) => {
    let isLoad = false;
    setTimeout(() => {
      if (!isLoad) {
        reject("拉起支付失败,请退出重新支付");
      }
    }, 5000);

    const onBridgeReady = () => {
      isLoad = true;
      // @ts-ignore
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: data.appId || "wxf103df5e7b296c46", //公众号ID，由商户传入
          timeStamp: data.timeStamp + "", //时间戳，自1970年以来的秒数
          nonceStr: data.nonceStr, //随机串
          package: data.package,
          signType: data.signType, //微信签名方式：
          paySign: data.paySign, //微信签名
        },
        function (res: any) {
          if (res.err_msg === "get_brand_wcpay_request:ok") {
            // 使用以上方式判断前端返回,微信团队郑重提示：
            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
            resolve({
              status: 10,
            });
          } else if (res.err_msg === "get_brand_wcpay_request:cancel") {
            //支付过程中取消
            resolve({
              status: 20,
            });
          } else if (res.err_msg === "get_brand_wcpay_request:fail") {
            resolve({
              status: 30,
            });
          }
        },
      );
    };
    // @ts-ignore
    if (typeof WeixinJSBridge == "undefined") {
      if (document.addEventListener) {
        document.addEventListener("WeixinJSBridgeReady", onBridgeReady, false);
      } else {
        // @ts-ignore
        if (document.attachEvent) {
          // @ts-ignore
          document.attachEvent("WeixinJSBridgeReady", onBridgeReady);
          // @ts-ignore
          document.attachEvent("onWeixinJSBridgeReady", onBridgeReady);
        }
      }
    } else {
      onBridgeReady();
    }
  });
}
