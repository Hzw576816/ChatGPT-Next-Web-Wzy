import { ErrorBoundary } from "@/app/components/error";
import Locale from "../locales";
import { IconButton } from "./button";
import { Path } from "../constant";
import CloseIcon from "../icons/close.svg";
import { useNavigate } from "react-router-dom";
import { BalanceListItem, List, ListItem } from "./ui-lib";
import styles from "./balance.module.scss";
import React, { useEffect, useState } from "react";
import { requestMyComboRecordsApi } from "@/app/requests";
import { Loading } from "@/app/components/home";

interface Balance {
  expired: boolean;
  extraProperties: {
    "GPT-3-Frequency": number;
    "GPT-3-Frequency-Use": number;
  };
  extend: {
    HasTokens: number;
    "GPT-3-Frequency-Has": number;
  };
  id: string;
  allTokens: number;
  duration: number;
  startTime: string;
  endTime: string;
  useTokens: number;
  creationTime: string;
  status: string;
  statusText: string;
  title: string;
  attrs: any[];
}

export function Balance(props: { isProfile?: boolean }) {
  const navigate = useNavigate();
  const [balanceList, setBalanceList] = useState<Balance[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const getComboRecords = async () => {
    let result = await requestMyComboRecordsApi();
    if (result.code === 0) {
      result.data.forEach((row: Balance) => {
        if (!row.attrs) row.attrs = [];
        row.attrs.push({
          label: "剩余",
          value: row.extend.HasTokens,
          unit: "Tokens",
        });
        row.attrs.push({
          label: "可用",
          value: row.extend["GPT-3-Frequency-Has"],
          unit: " 次聊天 (GTP-3.5)",
        });
      });
      setBalanceList(result.data);
    }
  };

  useEffect(() => {
    setLoading(true);
    getComboRecords().finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <ErrorBoundary>
      {!props.isProfile && (
        <div className="window-header" data-tauri-drag-region>
          <div className="window-header-title">
            <div className="window-header-main-title">
              {Locale.BalancePage.Title}
            </div>
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
                title={Locale.BalancePage.Actions.Close}
              />
            </div>
          </div>
        </div>
      )}
      <div
        className={styles["balance"]}
        style={{ padding: props.isProfile ? "0" : "20px" }}
      >
        {balanceList.length === 0 ? (
          <List>
            <div
              className={errorMessage ? styles["danger-text"] : ""}
              style={{
                height: "100px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {errorMessage ? (
                errorMessage
              ) : loading ? (
                <Loading noLogo logoLoading />
              ) : (
                Locale.BalancePage.NoBalance
              )}
            </div>
          </List>
        ) : (
          <></>
        )}
        {balanceList.length > 0 ? (
          balanceList.map((item) => {
            return (
              <BalanceListItem
                attrs={item.attrs}
                key={item.id}
                createTime={item.creationTime}
                endTime={item.endTime}
                id={item.id}
                status={item.status}
                statusText={item.statusText}
                title={item.title}
              ></BalanceListItem>
            );
          })
        ) : (
          <></>
        )}
        {!props.isProfile && (
          <List>
            <ListItem>
              <IconButton
                text={Locale.BalancePage.Actions.Pricing}
                block={true}
                type="primary"
                onClick={() => {
                  navigate(Path.Pricing);
                }}
              />
            </ListItem>
            <ListItem>
              <IconButton
                text={Locale.BalancePage.Actions.Profile}
                block={true}
                type="second"
                onClick={() => {
                  navigate(Path.Profile);
                }}
              />
            </ListItem>
            <ListItem>
              <IconButton
                text={Locale.BalancePage.Actions.Order}
                block={true}
                type="second"
                onClick={() => {
                  navigate(Path.Order);
                }}
              />
            </ListItem>
          </List>
        )}
      </div>
    </ErrorBoundary>
  );
}
