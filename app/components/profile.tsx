import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "@/app/components/error";
import Locale from "../locales";
import { IconButton } from "./button";
import CloseIcon from "../icons/close.svg";
import { Path } from "../constant";
import styles from "./profile.module.scss";
import { useAuthStore } from "../store";
import { List, ListItem, Popover } from "@/app/components/ui-lib";
import { AvatarImg } from "@/app/components/avatar-img";
import dynamic from "next/dynamic";
import { Loading } from "@/app/components/home";

const Balance = dynamic(async () => (await import("./balance")).Balance, {
  loading: () => <Loading noLogo logoLoading />,
});
export function Profile() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const { avatar, user } = authStore;

  const logout = () => {
    authStore.logout();
    navigate(Path.Login);
  };
  useEffect(() => {
    console.log(authStore.token);
    if (!authStore.token) {
      // navigate(Path.Login);
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="window-header" data-tauri-drag-region>
        <div className="window-header-title">
          <div className="window-header-main-title">{Locale.Profile.Title}</div>
          <div className="window-header-sub-title">
            {/* {Locale.Profile.SubTitle} */}
          </div>
        </div>
        <div className="window-actions">
          <div className="window-action-button">
            <IconButton
              icon={<CloseIcon />}
              onClick={() => navigate(Path.Home)}
              bordered
              title={Locale.Profile.Actions.Close}
            />
          </div>
        </div>
      </div>
      <div className={styles["profile"]}>
        {!authStore.token && (
          <div style={{ height: "100px", textAlign: "center" }}>
            <a
              href="javascript:void(0)"
              onClick={() => {
                navigate(Path.Login);
              }}
            >
              {Locale.PricingPage.PleaseLogin}
            </a>
          </div>
        )}
        {authStore.token && authStore.user && (
          <List>
            <ListItem title={Locale.Settings.Avatar}>
              <AvatarImg src={avatar} />
            </ListItem>

            {/*<ListItem title={Locale.Profile.AccountName}>*/}
            {/*    <span>{authStore.username}</span>*/}
            {/*</ListItem>*/}
            <ListItem title={Locale.Profile.Username}>
              <span>{authStore.username}</span>
            </ListItem>
            {user.phoneNumber ? (
              <ListItem title={Locale.Profile.Phone}>
                <span>{user.phoneNumber}</span>
              </ListItem>
            ) : (
              <></>
            )}
            <ListItem title={Locale.Profile.RegisterTime}>
              <span>{user.creationTime}</span>
            </ListItem>
          </List>
        )}
        <Balance isProfile></Balance>
        <List>
          <ListItem>
            <IconButton
              text={Locale.Profile.Actions.Pricing}
              block={true}
              type="primary"
              onClick={() => {
                navigate(Path.Pricing);
              }}
            />
          </ListItem>

          <ListItem>
            <IconButton
              text={Locale.Profile.Actions.Order}
              block={true}
              type="second"
              onClick={() => {
                navigate(Path.Order);
              }}
            />
          </ListItem>

          <ListItem>
            <IconButton
              text={Locale.LoginPage.Actions.Logout}
              block={true}
              type="second"
              onClick={() => {
                logout();
              }}
            />
          </ListItem>
        </List>
      </div>
    </ErrorBoundary>
  );
}
