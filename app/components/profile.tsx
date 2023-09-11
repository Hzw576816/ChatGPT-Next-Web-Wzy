import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ErrorBoundary } from "@/app/components/error";
import Locale from "../locales";
import { IconButton } from "./button";
import CloseIcon from "../icons/close.svg";
import { Path } from "../constant";
import styles from "./profile.module.scss";
import { useAuthStore, useProfileStore } from "../store";
import { List, ListItem, Popover } from "@/app/components/ui-lib";
import { AvatarImg } from "@/app/components/avatar-img";
import dynamic from "next/dynamic";
import { Loading } from "@/app/components/home";
import { requestGetMemberApi } from "@/app/requests";

const Balance = dynamic(async () => (await import("./balance")).Balance, {
  loading: () => <Loading noLogo logoLoading />,
});

export function Profile() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const profileStore = useProfileStore();
  const { avatar, user } = authStore;
  const { member } = profileStore;

  const logout = () => {
    authStore.logout();
    navigate(Path.Login);
  };
  useEffect(() => {
    if (!authStore.token) {
      navigate(Path.Login);
    }
    requestGetMemberApi().then((result) => {
      if (result.code === 0) {
        profileStore.setMember(result.data);
      }
    });
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
            <ListItem title={Locale.Profile.Point}>
              <span>{member?.usablePoints || "0"}</span>
            </ListItem>
            <ListItem title={Locale.Profile.MemberCard}>
              <span>{member?.memberCard || "0"}</span>
            </ListItem>
            <ListItem title={Locale.Profile.RegisterTime}>
              <span>{user.creationTime}</span>
            </ListItem>
            <ListItem subTitle="以下仅展示最早到期的套餐">
              <IconButton
                text={Locale.Profile.Actions.All}
                type="second"
                style={{ flexShrink: 0 }}
                onClick={() => {
                  navigate(Path.Balance);
                }}
              />
            </ListItem>
            <ListItem subTitle="会话模型所需积分请点击右侧按钮查看">
              <IconButton
                text={Locale.Profile.Actions.Models}
                type="second"
                style={{ flexShrink: 0 }}
                onClick={() => {
                  navigate(Path.Models);
                }}
              />
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
              text={Locale.Profile.Actions.PointsChangeRecords}
              block={true}
              type="second"
              onClick={() => {
                navigate(Path.PointsRecords);
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
