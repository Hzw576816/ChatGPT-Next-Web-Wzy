import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NextImage from "next/image";
import QRCode from "qrcode.react";
import styles from "./pay.module.scss";
import CloseIcon from "../icons/close.svg";
import { ErrorBoundary } from "./error";
import { useAuthStore, useWebsiteConfigStore } from "../store";
import { IconButton } from "./button";
import { Path } from "../constant";
import Locale from "../locales";
import { showToast } from "./ui-lib";
import {
  requestCheckPayOrderPaidApi,
  requestGetPayOrderApi,
} from "@/app/requests";
import { Loading } from "@/app/components/home";
import WechatPayLogo from "../icons/wechat-pay-logo.png";
import ConfirmIcon from "@/app/icons/confirm.svg";

let needCleanTimer: boolean;

export function PayPc() {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderNo = params.get("orderNo");
  const [order, setOrder] = useState(null as any);
  const [isTokenValid, setTokenValid] = useState("unknown");
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const getOrderInfo = async () => {
    let result = await requestGetPayOrderApi(orderNo);
    if (result.code === 401) {
      setTokenValid("invalid");
    } else if (result.code === 0) {
      const order = result.data;
      const attachData = JSON.parse(order.attachData);
      setOrder(order);
      setQrCode(attachData.CodeUrl);
      const { _ordersStatus } = order;
      if (_ordersStatus.name !== "Paid") {
        await checkIsPay();
      }
    } else {
    }
  };

  const checkIsPay = async () => {
    if (needCleanTimer) {
      return false;
    }
    let result = await requestCheckPayOrderPaidApi(orderNo);
    //未支付继续轮询
    if (result.data === "UnPaid") {
      // 在1500毫秒后再次调用checkIsPay进行轮询
      setTimeout(checkIsPay, 1500);
    } else {
      if (result.data === "Paid") {
        //已支付需要跳转页面了
        showToast(Locale.PayPage.PaidSuccess);
        setIsPaid(true);
        setTimeout(() => {
          needCleanTimer = true;
          navigate(Path.Balance);
        }, 1500);
      }
    }
  };
  useEffect(() => {
    setLoading(true);
    getOrderInfo().finally(() => {
      setLoading(false);
    });
    return () => {
      needCleanTimer = true;
    };
  }, []);
  return (
    <ErrorBoundary>
      <div className="window-header" data-tauri-drag-region>
        <div className="window-header-title">
          <div className="window-header-main-title">{"订单支付"}</div>
          {/*<div className="window-header-sub-title">{""}</div>*/}
        </div>
        <div className="window-actions">
          <div className="window-action-button">
            <IconButton
              icon={<CloseIcon />}
              onClick={() => navigate(Path.Home)}
              bordered
              title={Locale.PayPage.Actions.Close}
            />
          </div>
        </div>
      </div>
      <div className={styles["pay"]}>
        <div className={styles["container"]}>
          <NextImage
            src={WechatPayLogo.src}
            width={127}
            height={27}
            alt="wechat-pay"
          />
          <div style={{ marginTop: "10px" }}>
            {order ? order.description : "套餐购买"}
          </div>
          <div style={{ lineHeight: "50px" }}>
            ￥
            <span style={{ fontSize: "32px" }}>
              {order && order.totalAmount}
            </span>
          </div>
          {!qrCode ? (
            <div
              style={{
                width: "230px",
                height: "230px",
                lineHeight: "230px",
                textAlign: "center",
              }}
            >
              <Loading noLogo logoLoading />
            </div>
          ) : (
            <div
              style={{
                padding: "8px",
                background: "#fff",
                position: "relative",
              }}
            >
              <QRCode size={230} value={qrCode} />
              {isPaid && (
                <div className={styles["icon-paid"]}>
                  <IconButton
                    type="primary"
                    icon={<ConfirmIcon />}
                    key="ok"
                    onClick={() => {}}
                  />
                  <span className={styles["text"]}>支付成功</span>
                </div>
              )}
            </div>
          )}
          <div className={styles["bottom"]}>请使用微信扫码支付</div>
        </div>

        {order && (
          <div style={{ textAlign: "center", margin: "20px" }}>
            当前订单：{order._ordersStatus.text}
          </div>
        )}

        <div className={styles["buttons"]}>
          <div style={{ marginBottom: "10px" }}>
            <IconButton
              text={Locale.Profile.Actions.Pricing}
              block={true}
              type="second"
              onClick={() => {
                navigate(Path.Pricing);
              }}
            />
          </div>
          <div>
            <IconButton
              text={Locale.PricingPage.Actions.Order}
              block={true}
              type="second"
              onClick={() => {
                navigate(Path.Order);
              }}
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
