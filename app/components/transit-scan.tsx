import { useLocation } from "react-router-dom";
import { Loading } from "@/app/components/home";
import React from "react";
import { wxAuth } from "@/app/hooks/useAuth";

export function TransitScan() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  wxAuth({
    query: {
      scanCode: params.get("scanCode"),
    },
  });
  return <Loading noLogo logoLoading />;
}
