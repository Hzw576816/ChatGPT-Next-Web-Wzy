"use client";

import { requestGetSettingApi } from "@/app/requests";

require("../polyfill");

import { useState, useEffect } from "react";

import styles from "./home.module.scss";
import NextImage from "next/image";

import ChatBotIcon from "../icons/ai-chat-bot.jpg";
import BotIcon from "../icons/bot.svg";
import LoadingIcon from "../icons/three-dots.svg";

import { getCSSVar, useMobileScreen } from "../utils";

import dynamic from "next/dynamic";
import { Path, SlotID } from "../constant";
import { ErrorBoundary } from "./error";

import { getISOLang, getLang } from "../locales";

import {
  // HashRouter as Router,
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { SideBar } from "./sidebar";
import { useAppConfig } from "../store/config";
import { AuthPage } from "./auth";
import { getClientConfig } from "../config/client";
import { api } from "../client/api";
import { useAccessStore, useAuthStore, useWebsiteConfigStore } from "../store";

export function Loading(props: {
  noLogo?: boolean;
  logoLoading: boolean;
  logoUrl?: string;
}) {
  const logoLoading = props.logoLoading;
  const logoUrl = props.logoUrl;
  const noLogo = props.noLogo;
  return (
    <div className={styles["loading-content"] + " no-dark"}>
      {!props.noLogo && (
        <NextImage
          src={ChatBotIcon.src}
          width={30}
          height={30}
          alt="bot"
          className="user-avatar"
        />
      )}
      <LoadingIcon />
    </div>
  );
}

const Login = dynamic(async () => (await import("./login")).Login, {
  loading: () => <Loading noLogo logoLoading />,
});

const Settings = dynamic(async () => (await import("./settings")).Settings, {
  loading: () => <Loading noLogo logoLoading />,
});

const Chat = dynamic(async () => (await import("./chat")).Chat, {
  loading: () => <Loading noLogo logoLoading />,
});

const NewChat = dynamic(async () => (await import("./new-chat")).NewChat, {
  loading: () => <Loading noLogo logoLoading />,
});

const MaskPage = dynamic(async () => (await import("./mask")).MaskPage, {
  loading: () => <Loading noLogo logoLoading />,
});

const Pricing = dynamic(async () => (await import("./pricing")).Pricing, {
  loading: () => <Loading noLogo logoLoading />,
});

const Pay = dynamic(async () => (await import("./pay-pc")).PayPc, {
  loading: () => <Loading noLogo logoLoading />,
});

const Order = dynamic(async () => (await import("./order")).Order, {
  loading: () => <Loading noLogo logoLoading />,
});

const Balance = dynamic(async () => (await import("./balance")).Balance, {
  loading: () => <Loading noLogo logoLoading />,
});

const Profile = dynamic(async () => (await import("./profile")).Profile, {
  loading: () => <Loading noLogo logoLoading />,
});

const TransitScan = dynamic(
  async () => (await import("./transit-scan")).TransitScan,
  {
    loading: () => <Loading noLogo logoLoading />,
  },
);

const PointsRecords = dynamic(
  async () => (await import("./points-records")).PointsRecords,
  {
    loading: () => <Loading noLogo logoLoading />,
  },
);

const ListModels = dynamic(
  async () => (await import("./list-models")).ListModels,
  {
    loading: () => <Loading noLogo logoLoading />,
  },
);

const WxLogin = dynamic(async () => (await import("./wx-login")).WxLogin, {
  loading: () => <Loading noLogo logoLoading />,
});

export function useSwitchTheme() {
  const config = useAppConfig();

  useEffect(() => {
    document.body.classList.remove("light");
    document.body.classList.remove("dark");

    if (config.theme === "dark") {
      document.body.classList.add("dark");
    } else if (config.theme === "light") {
      document.body.classList.add("light");
    }

    const metaDescriptionDark = document.querySelector(
      'meta[name="theme-color"][media*="dark"]',
    );
    const metaDescriptionLight = document.querySelector(
      'meta[name="theme-color"][media*="light"]',
    );

    if (config.theme === "auto") {
      metaDescriptionDark?.setAttribute("content", "#151515");
      metaDescriptionLight?.setAttribute("content", "#fafafa");
    } else {
      const themeColor = getCSSVar("--theme-color");
      metaDescriptionDark?.setAttribute("content", themeColor);
      metaDescriptionLight?.setAttribute("content", themeColor);
    }
  }, [config.theme]);
}

function useHtmlLang() {
  useEffect(() => {
    const lang = getISOLang();
    const htmlLang = document.documentElement.lang;

    if (lang !== htmlLang) {
      document.documentElement.lang = lang;
    }
  }, []);
}

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

const loadAsyncGoogleFont = () => {
  const linkEl = document.createElement("link");
  const proxyFontUrl = "/google-fonts";
  const remoteFontUrl = "https://fonts.googleapis.com";
  const googleFontUrl =
    getClientConfig()?.buildMode === "export" ? remoteFontUrl : proxyFontUrl;
  linkEl.rel = "stylesheet";
  linkEl.href =
    googleFontUrl + "/css2?family=Noto+Sans:wght@300;400;700;900&display=swap";
  document.head.appendChild(linkEl);
};

function setFavicon(url: string, mimeType: string) {
  const link = document.createElement("link");
  link.rel = "shortcut icon";
  link.type = "image/svg+xml";
  link.href = url;
  const head = document.querySelector("head");
  if (head == null) {
    console.error("head is null");
    return;
  }
  const existingLink = document.querySelector('head link[rel="shortcut icon"]');
  if (existingLink) {
    head.removeChild(existingLink);
  }
  head.appendChild(link);
}

function Screen(props: { logoLoading: boolean; logoUrl?: string }) {
  const config = useAppConfig();
  const location = useLocation();
  const isHome = location.pathname === Path.Home;
  const isAuth = location.pathname === Path.Auth;
  const isMobileScreen = useMobileScreen();

  useEffect(() => {
    loadAsyncGoogleFont();
  }, []);
  const logoLoading = props.logoLoading;
  const logoUrl = props.logoUrl || "";
  useEffect(() => {
    setFavicon(logoUrl, "");
  }, [logoUrl]);

  const separator = (
    [Path.Login, Path.WxLogin, Path.TransitScan] as string[]
  ).includes(location.pathname);
  return (
    <div className={(separator ? "separator-page " : "") + "body"}>
      <div
        className={
          styles.container +
          ` ${
            config.tightBorder && !isMobileScreen
              ? styles["tight-container"]
              : styles.container
          } ${getLang() === "ar" ? styles["rtl-screen"] : ""}`
        }
      >
        {isAuth ? (
          <>
            <AuthPage />
          </>
        ) : (
          <>
            {!separator && (
              <SideBar className={isHome ? styles["sidebar-show"] : ""} />
            )}

            <div className={styles["window-content"]} id={SlotID.AppBody}>
              <Routes>
                <Route path={Path.Home} element={<Chat />} />
                <Route path={Path.NewChat} element={<NewChat />} />
                <Route path={Path.Masks} element={<MaskPage />} />
                <Route path={Path.Chat} element={<Chat />} />
                <Route path={Path.Settings} element={<Settings />} />
                <Route
                  path={Path.Login}
                  element={
                    <Login logoLoading={logoLoading} logoUrl={logoUrl} />
                  }
                />
                <Route path={Path.Pricing} element={<Pricing />} />
                <Route path={Path.Pay} element={<Pay />} />
                <Route path={Path.Order} element={<Order />} />
                <Route path={Path.Balance} element={<Balance />} />
                <Route path={Path.Profile} element={<Profile />} />
                <Route path={Path.WxLogin} element={<WxLogin />} />
                <Route path={Path.TransitScan} element={<TransitScan />} />
                <Route path={Path.PointsRecords} element={<PointsRecords />} />
                <Route path={Path.Models} element={<ListModels />} />
              </Routes>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function useLoadData() {
  const config = useAppConfig();
  const authStore = useAuthStore();
  useEffect(() => {
    if (authStore.token) {
      (async () => {
        const models = await api.llm.models();
        config.mergeModels(models);
        let userConfigResult = await requestGetSettingApi();
        if (userConfigResult.code === 0 && userConfigResult.data) {
          config.overrideConfig(userConfigResult.data);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStore.token]);
}

export function Home() {
  useSwitchTheme();
  useLoadData();
  useHtmlLang();
  const [logoLoading, setLogoLoading] = useState(false);
  const { logoUrl } = useWebsiteConfigStore();
  useEffect(() => {
    console.log("[Config] got config from build time", getClientConfig());
    useAccessStore.getState().fetch();
  }, []);

  if (!useHasHydrated()) {
    return <Loading noLogo logoLoading />;
  }

  return (
    <ErrorBoundary>
      <Router>
        <Screen logoLoading={logoLoading} logoUrl={logoUrl} />
      </Router>
    </ErrorBoundary>
  );
}
