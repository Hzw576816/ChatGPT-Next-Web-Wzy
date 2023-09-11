import { ErrorBoundary } from "@/app/components/error";
import Locale from "@/app/locales";
import { IconButton } from "@/app/components/button";
import CloseIcon from "@/app/icons/close.svg";
import { Path } from "@/app/constant";
import styles from "@/app/components/points-records.module.scss";
import {
  List,
  ListItem,
  PointsChangeRecordsItem,
} from "@/app/components/ui-lib";
import { Loading } from "@/app/components/home";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPointsChangeRecordsApi } from "@/app/requests";

interface PointsRecordsDto {
  id: string;
  memberId: string;
  points: number;
  isDeduct: boolean;
  description: string;
  creationTime: string;
}

export function PointsRecords() {
  const navigate = useNavigate();
  const [list, setList] = useState<PointsRecordsDto[]>([]);
  const [loading, setLoading] = useState(false);

  const getRecords = async () => {
    let result = await requestPointsChangeRecordsApi();
    if (result.code === 0) {
      setList(result.data);
    }
  };

  useEffect(() => {
    setLoading(true);
    getRecords().finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <ErrorBoundary>
      <div className="window-header" data-tauri-drag-region>
        <div className="window-header-title">
          <div className="window-header-main-title">
            {Locale.PointsChangePage.Title}
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
      <div className={styles["records-list"]}>
        {list.length === 0 ? (
          <List>
            <div
              style={{
                height: "100px",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {loading ? (
                <Loading noLogo logoLoading />
              ) : (
                Locale.PointsChangePage.NoRecords
              )}
            </div>
          </List>
        ) : (
          <></>
        )}

        {list.length ? (
          list.map((item) => {
            return (
              <PointsChangeRecordsItem
                isDeduct={item.isDeduct}
                key={item.id}
                title={item.description}
                time={item.creationTime}
                points={item.points < 0 ? item.points * -1 : item.points}
              ></PointsChangeRecordsItem>
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
