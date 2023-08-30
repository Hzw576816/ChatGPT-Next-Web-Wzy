import React, { useState, useEffect, useMemo } from "react";
import styles from "./login.module.scss";
import NextImage from "next/image";
import { SingleInput, List, ListItem, PasswordInput } from "./ui-lib";
import { IconButton } from "./button";
import Locale from "../locales";
import { Path } from "../constant";
import { ErrorBoundary } from "./error";
import { useNavigate } from "react-router-dom";
import { showToast } from "../components/ui-lib";
import { useMobileScreen } from "../utils";
import { getClientConfig } from "../config/client";
import {
  appid,
  isInWechat,
  redirectUrl,
  transitScanUrl,
  wxAuthUrl,
} from "../utils/wechat";
import { useAppConfig, useAuthStore, useWebsiteConfigStore } from "../store";
import MaxIcon from "../icons/max.svg";
import MinIcon from "../icons/min.svg";
import ChatBotIcon from "../icons/ai-chat-bot.jpg";
import WechatIcon from "../icons/wechat.svg";
import { wxAuth } from "@/app/hooks/useAuth";
import ReturnIcon from "../icons/return.svg";
import {
  CallResult,
  requestCheckScanStatusApi,
  requestGenerateScanCodeApi,
} from "@/app/requests";
import QRCode from "qrcode.react";
import ConfirmIcon from "@/app/icons/confirm.svg";
import ReloadIcon from "@/app/icons/reload.svg";
import { Loading } from "@/app/components/home";

interface ScanResult {
  code: string;
  message: string;
}

let needCleanTimer: boolean;

export function Login(props: { logoLoading: boolean; logoUrl?: string }) {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const config = useAppConfig();
  const isMobileScreen = useMobileScreen();
  const clientConfig = useMemo(() => getClientConfig(), []);
  const showMaxIcon = !isMobileScreen && !clientConfig?.isApp;
  const { loginPageSubTitle, mainTitle } = useWebsiteConfigStore();
  const [loadingUsage, setLoadingUsage] = useState(false);
  const [loadingQrCode, setLoadingQrCode] = useState(false);
  const [showWechatCode, setShowWechatCode] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult>();

  useEffect(() => {
    const keydownEvent = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate(Path.Home);
      }
    };
    document.addEventListener("keydown", keydownEvent);
    return () => {
      document.removeEventListener("keydown", keydownEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkScan = (qrCode: string) => {
    if (needCleanTimer) {
      return false;
    }
    requestCheckScanStatusApi(qrCode).then((res) => {
      if (res.code === 0) {
        const { data } = res;
        setScanResult(data);
        if (data.code === "not-scan") {
          setTimeout(() => {
            checkScan(qrCode);
          }, 1500);
        } else {
          if (data.code === "success") {
            authStore.setLogin({ data } as CallResult);
          }
        }
      }
    });
  };

  const generateScanCode = () => {
    setLoadingQrCode(false);
    requestGenerateScanCodeApi().then((result) => {
      if (result.code === 0) {
        const url = transitScanUrl(result.data);
        setQrCode(url);
        checkScan(result.data);
      }
      setLoadingQrCode(true);
    });
  };

  useEffect(() => {
    if (showWechatCode) {
      needCleanTimer = false;
      //生成二维码
      generateScanCode();
    } else {
      needCleanTimer = true;
    }
  }, [showWechatCode]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function login() {
    if (!username) {
      showToast(Locale.LoginPage.Toast.EmptyUserName);
      return;
    }

    if (!password) {
      showToast(Locale.LoginPage.Toast.EmptyPassword);
      return;
    }

    setLoadingUsage(true);

    showToast(Locale.LoginPage.Toast.Logining);
    authStore
      .login(username, password)
      .then((result) => {
        if (result && result.code == 0) {
          showToast(Locale.LoginPage.Toast.Success);
          navigate(Path.Chat);
        } else if (result && result.message) {
          showToast(result.message);
        }
      })
      .finally(() => {
        setLoadingUsage(false);
      });
  }

  function logout() {
    authStore.logout();
  }

  function toWxLogin() {
    if (isInWechat()) {
      wxAuth({});
    } else {
      setShowWechatCode(true);
    }
  }

  return (
    <ErrorBoundary>
      <div className="window-header" data-tauri-drag-region>
        <div className="window-header-title">
          <div className="window-header-main-title">
            {Locale.LoginPage.Title}
          </div>
          <div className="window-header-sub-title">{loginPageSubTitle}</div>
        </div>
        <div className="window-actions">
          {showMaxIcon && (
            <div className="window-action-button">
              <IconButton
                icon={config.tightBorder ? <MinIcon /> : <MaxIcon />}
                bordered
                onClick={() => {
                  config.update(
                    (config) => (config.tightBorder = !config.tightBorder),
                  );
                }}
              />
            </div>
          )}
          {/* <div className="window-action-button">
            <IconButton
              icon={<CloseIcon />}
              onClick={() => navigate(Path.Home)}
              bordered
              title={Locale.LoginPage.Actions.Close}
            />
          </div> */}
        </div>
      </div>
      <div className={styles["login"]}>
        <div style={{ textAlign: "center" }}>
          <div className={"no-dark"}>
            {props.logoLoading ? (
              <></>
            ) : !props.logoUrl ? (
              <NextImage
                src={ChatBotIcon.src}
                width={94.64788868}
                height={56}
                alt="bot"
              />
            ) : (
              <img src={props.logoUrl} width={64} height={64} />
            )}
          </div>
          <div
            style={{ lineHeight: "100px" }}
            dangerouslySetInnerHTML={{
              __html: mainTitle || "AI Chat",
            }}
            data-tauri-drag-region
          ></div>
        </div>
        <List>
          {!showWechatCode ? (
            <ListItem
              title={Locale.LoginPage.Username.Title}
              subTitle={Locale.LoginPage.Username.SubTitle}
            >
              {authStore.token ? (
                <span>{authStore.username}</span>
              ) : (
                <SingleInput
                  tabIndex={1}
                  value={username}
                  placeholder={Locale.LoginPage.Username.Placeholder}
                  onChange={(e) => {
                    setUsername(e.currentTarget.value);
                  }}
                />
              )}
            </ListItem>
          ) : undefined}

          {authStore.token || showWechatCode ? (
            <></>
          ) : (
            <ListItem
              title={Locale.LoginPage.Password.Title}
              subTitle={Locale.LoginPage.Password.SubTitle}
            >
              <PasswordInput
                value={password}
                type="text"
                tabIndex={2}
                placeholder={Locale.LoginPage.Password.Placeholder}
                onChange={(e) => {
                  setPassword(e.currentTarget.value);
                }}
              />
            </ListItem>
          )}
          {!showWechatCode ? (
            <ListItem>
              <IconButton
                type="primary"
                text={
                  authStore.token
                    ? Locale.LoginPage.Actions.Logout
                    : Locale.LoginPage.Actions.Login
                }
                block={true}
                onClick={() => {
                  if (authStore.token) {
                    logout();
                  } else {
                    login();
                  }
                }}
              />
            </ListItem>
          ) : undefined}

          {!authStore.token && !showWechatCode ? (
            <div
              style={{
                borderBottom: "var(--border-in-light)",
                minHeight: "40px",
                padding: "10px 20px",
                textAlign: "center",
              }}
            >
              <div style={{ margin: "0 auto", display: "inline-block" }}>
                <IconButton
                  icon={<WechatIcon />}
                  type="second"
                  text="微信登录/注册"
                  onClick={() => {
                    toWxLogin();
                  }}
                />
                {/*注册或点击登录代表您同意《服务使用协议》&《隐私政策》*/}
              </div>
            </div>
          ) : (
            <></>
          )}
          {showWechatCode ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "16px",
              }}
            >
              <div
                style={{
                  padding: "8px",
                  background: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "276px",
                  height: "276px",
                  position: "relative",
                  justifyContent: "center",
                }}
              >
                {loadingQrCode ? (
                  <>
                    <QRCode
                      size={256}
                      includeMargin
                      imageSettings={{
                        src: ChatBotIcon.src,
                        height: 22,
                        width: 36,
                        excavate: true,
                      }}
                      value={qrCode}
                    />
                    <span style={{ fontSize: "14px" }}>
                      请打开微信APP扫一扫
                    </span>
                  </>
                ) : (
                  <Loading noLogo logoLoading />
                )}
                {scanResult?.code === "success" ||
                  (scanResult?.code === "expired" && (
                    <div className={styles["icon-paid"]}>
                      <IconButton
                        type={
                          scanResult.code === "expired" ? "danger" : "primary"
                        }
                        icon={
                          scanResult.code === "expired" ? (
                            <ReloadIcon />
                          ) : (
                            <ConfirmIcon />
                          )
                        }
                        key="ok"
                        onClick={() => {
                          if (scanResult?.code === "expired") {
                            generateScanCode();
                          }
                        }}
                      />
                      <span className={styles["text"]}>
                        {scanResult.message}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          ) : undefined}
          {showWechatCode ? (
            <div
              style={{
                borderBottom: "var(--border-in-light)",
                minHeight: "40px",
                lineHeight: "40px",
                padding: "10px 20px",
                textAlign: "center",
              }}
            >
              <div style={{ margin: "0 auto", display: "inline-block" }}>
                <IconButton
                  icon={<ReturnIcon />}
                  type="second"
                  text="返回"
                  onClick={() => {
                    setShowWechatCode(false);
                  }}
                />
              </div>
            </div>
          ) : (
            <></>
          )}
        </List>
      </div>
    </ErrorBoundary>
  );
}
