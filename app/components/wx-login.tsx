import { Loading } from "@/app/components/home";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { requestScanLoginSaveApi, requestWxLoginApi } from "@/app/requests";
import { showToast } from "../components/ui-lib";
import { Path } from "../constant";
import { useAuthStore } from "@/app/store";

export function WxLogin() {
  const navigate = useNavigate();
  const authStore = useAuthStore();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const from = params.get("from");
  const wxCode = params.get("code");
  const memberCard = !params.get("memberCard");
  const scanCode = params.get("scanCode");
  useEffect(() => {
    if (wxCode) {
      if (scanCode) {
        requestScanLoginSaveApi(wxCode, scanCode).then((result) => {
          if (result.code === 0) {
            alert(JSON.stringify(result));
          }
        });
      } else {
        requestWxLoginApi(wxCode, memberCard).then((result) => {
          if (result.code === 0) {
            authStore.setLogin(result);
            navigate(Path.Home);
          } else {
            showToast(result.message as string);
            navigate(Path.Login);
          }
        });
      }
    }
  }, []);
  return <Loading noLogo logoLoading />;
}
