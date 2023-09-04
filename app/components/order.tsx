import styles from "./order.module.scss";
import { ErrorBoundary } from "@/app/components/error";
import Locale from "../locales";
import { IconButton } from "./button";
import CloseIcon from "../icons/close.svg";
import { Path } from "../constant";
import { useNavigate } from "react-router-dom";
import { requestMyOrderApi } from "@/app/requests";
import React, { useEffect, useState } from "react";
import { Loading } from "@/app/components/home";

import { List, ListItem, OrderListItem } from "./ui-lib";

interface EnumEntity {
  name: string;
  text: string;
}

interface Order {
  id: string;
  orderNo: string;
  totalAmount: string;
  totalPoints: number;
  description: string;
  ordersStatus: number;
  ordersType: number;
  creationTime: string;
  payTime: string;
  ordersStatusText: string;
  attachData: {
    MemberTypeId: string;
    ReChargeId: string;
    Duration: string;
    AllowTokens: string;
    Frequency: string;
    GivePoints: string;
    CodeUrl: string;
  };
  attrs: any[];
  payMode: number;
  _payMode: EnumEntity;
}

export function Order() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const getOrder = async () => {
    let result = await requestMyOrderApi();
    if (result.code === 0) {
      setOrderList(result.data.items);
    }
  };

  useEffect(() => {
    setLoading(true);
    getOrder().finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <ErrorBoundary>
      <div className="window-header" data-tauri-drag-region>
        <div className="window-header-title">
          <div className="window-header-main-title">
            {Locale.OrderPage.Title}
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
              title={Locale.Profile.Actions.Close}
            />
          </div>
        </div>
      </div>
      <div className={styles["order-list"]}>
        {orderList.length === 0 ? (
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
                Locale.OrderPage.NoOrder
              )}
            </div>
          </List>
        ) : (
          <></>
        )}

        {orderList.length ? (
          orderList.map((item) => {
            return (
              <OrderListItem
                totalPoints={item.totalPoints}
                payMode={item._payMode.name}
                payTime={item.payTime}
                createTime={item.creationTime}
                ordersStatusText={item.ordersStatusText}
                orderNo={item.orderNo}
                attrs={item.attrs}
                description={item.description}
                key={item.id}
                id={item.id}
                totalAmount={item.totalAmount}
              ></OrderListItem>
            );
          })
        ) : (
          <></>
        )}

        <List>
          <ListItem>
            <IconButton
              text={Locale.OrderPage.Actions.Pricing}
              block={true}
              type="primary"
              onClick={() => {
                navigate(Path.Pricing);
              }}
            />
          </ListItem>

          <ListItem>
            <IconButton
              text={Locale.OrderPage.Actions.Profile}
              block={true}
              type="second"
              onClick={() => {
                navigate(Path.Profile);
              }}
            />
          </ListItem>
        </List>
      </div>
    </ErrorBoundary>
  );
}
