import { ErrorBoundary } from "@/app/components/error";
import Locale from "@/app/locales";
import { IconButton } from "@/app/components/button";
import CloseIcon from "@/app/icons/close.svg";
import { Path } from "@/app/constant";
import styles from "@/app/components/list-models.module.scss";
import { List, ListItem, ListModelsItem } from "@/app/components/ui-lib";
import { Loading } from "@/app/components/home";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestGptModelsListApi } from "@/app/requests";

interface ListModelDto {
  alias: string;
  id: string;
  inputPrice: number;
  name: string;
  outputPrice: number;
  points: number;
}

export function ListModels() {
  const navigate = useNavigate();
  const [list, setList] = useState<ListModelDto[]>([]);
  const [loading, setLoading] = useState(false);

  const getModels = async () => {
    let result = await requestGptModelsListApi();
    if (result.code === 0) {
      setList(result.data);
    }
  };

  useEffect(() => {
    setLoading(true);
    getModels().finally(() => {
      setLoading(false);
    });
  }, []);
  return (
    <ErrorBoundary>
      <div className="window-header" data-tauri-drag-region>
        <div className="window-header-title">
          <div className="window-header-main-title">
            {Locale.ListModelsPage.Title}
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
      <div className={styles["list-models"]}>
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
                Locale.ListModelsPage.NoRecords
              )}
            </div>
          </List>
        ) : (
          <></>
        )}

        {list.length ? (
          list.map((item) => {
            return (
              <ListModelsItem
                key={item.id}
                name={item.name}
                alias={item.alias}
                points={item.points}
              ></ListModelsItem>
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
