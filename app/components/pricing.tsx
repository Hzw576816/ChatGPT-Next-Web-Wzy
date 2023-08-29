import React, { useState, useEffect } from "react";
import styles from "./pricing.module.scss";
import CloseIcon from "../icons/close.svg";
import {
  Input,
  List,
  DangerousListItem,
  ListItem,
  Modal,
  PasswordInput,
  ComboListItem,
} from "./ui-lib";
import { IconButton } from "./button";

import { useAuthStore, useAccessStore, useWebsiteConfigStore } from "../store";

import Locale from "../locales";
import { Path } from "../constant";
import { ErrorBoundary } from "./error";
import { useNavigate } from "react-router-dom";
import { showToast } from "./ui-lib";
import { useRouter } from "next/navigation";
import { Loading } from "@/app/components/home";
import {
  CallResult,
  requestPayComboApi,
  requestComboList,
} from "@/app/requests";
import { isInWechat, wxPayBridge } from "@/app/utils/wechat";

interface memberShipCharge {
  id: string;
  name: string;
  price: string;
  discountedPrice: string;
  duration: number;
  givePoints: number;
  allowReChargeCount: number;
  allowTokens: number;
  frequency: number;
  sort: number;
  attrs: any[];
  memberTypeId: string;
}

export interface ComboDto {
  id: string;
  name: string;
  isEnabled: boolean;
  isVisible: boolean;
  memberShipCharges: memberShipCharge[];
  sort: number;
  isDefault: boolean;
}

export function Pricing() {
  const router = useRouter();
  const navigate = useNavigate();
  const authStore = useAuthStore();

  const [comboData, setComboData] = useState({} as ComboDto);
  const [loading, setLoading] = useState(false);
  const [isTokenValid, setTokenValid] = useState("unknown");

  const requestCombo = async () => {
    let result: CallResult = await requestComboList();
    if (result.code === 401) {
      setTokenValid("invalid");
    } else {
      if (result.data && result.data.length === 1) {
        let data = result.data[0];
        data.memberShipCharges.forEach((row: memberShipCharge) => {
          row.memberTypeId = data.id;
          if (!row.attrs) row.attrs = [];
          row.attrs.push({
            label: "可用",
            value: row.allowTokens,
            unit: "Tokens",
          });
          row.attrs.push({
            label: "可用",
            value: row.frequency,
            unit: " 次聊天 (GTP-3.5)",
          });
          row.attrs.push({
            label: "有效期",
            value: `${row.duration}`,
            unit: "天",
          });
        });
        setComboData(data);
      }
      setTokenValid("valid");
    }
  };

  useEffect(() => {
    setLoading(true);
    requestCombo().finally(() => {
      setLoading(false);
    });
  }, []);

  async function handleToBuy(item: memberShipCharge) {
    //判断环境
    let isWx = isInWechat();
    setLoading(true);
    let result = await requestPayComboApi(
      item.memberTypeId,
      item.id,
      isWx ? "JSAPI" : "NATIVE",
    );
    if (isWx) {
      wxPayBridge(result.data)
        .then((res: any) => {
          setLoading(false);
          if (res.status === 10) {
            showToast("支付成功");
            //跳转支付成功页面,去后台查询是否实际已支付成功
            setTimeout(() => {
              navigate(Path.Balance);
            }, 1500);
            // router.replace({name: "paySuccess", query: {orderNo: result.orderNo}})
          } else {
            showToast("取消支付");
          }
        })
        .catch((err) => {
          setLoading(false);
          showToast(err);
        });
    } else {
      navigate(Path.Pay + "?orderNo=" + result.data.orderNo);
    }
  }

  return (
    <ErrorBoundary>
      <div className="window-header" data-tauri-drag-region>
        <div className="window-header-title">
          <div className="window-header-main-title">
            {Locale.PricingPage.Title || "购买套餐"}
          </div>
          <div className="window-header-sub-title">
            {Locale.PricingPage.SubTitle || "畅享与AI聊天的乐趣"}
          </div>
        </div>
        <div className="window-actions">
          <div className="window-action-button">
            <IconButton
              icon={<CloseIcon />}
              onClick={() => navigate(Path.Home)}
              bordered
              title={Locale.PricingPage.Actions.Close}
            />
          </div>
        </div>
      </div>
      <div className={styles["pricing"]}>
        {loading ? (
          <div style={{ padding: "24px 0 48px 0" }}>
            <Loading noLogo logoLoading />
          </div>
        ) : (
          <></>
        )}

        {!loading && isTokenValid === "invalid" && (
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

        {comboData?.memberShipCharges?.map((item) => {
          return (
            <ComboListItem
              allowReChargeCount={item.allowReChargeCount}
              id={item.id}
              attrs={item.attrs}
              title={item.name}
              discountedPrice={item.discountedPrice}
              price={item.price}
              key={item.id}
            >
              <IconButton
                text={Locale.PricingPage.Actions.Buy}
                type="danger"
                block={true}
                disabled={loading}
                onClick={() => {
                  handleToBuy(item);
                }}
              />
            </ComboListItem>
          );
        })}

        <List>
          <ListItem>
            <IconButton
              text={Locale.PricingPage.Actions.Order}
              block={true}
              type="second"
              onClick={() => {
                navigate(Path.Order);
              }}
            />
          </ListItem>
        </List>
      </div>
    </ErrorBoundary>
  );
}
