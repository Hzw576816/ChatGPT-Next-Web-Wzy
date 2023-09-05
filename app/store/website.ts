import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKey } from "../constant";

export interface WebsiteConfigStore {
  title: string;
  mainTitle: string;
  subTitle: string;
  loginPageSubTitle: string;
  logoUrl: string;
}

export const useWebsiteConfigStore = create<WebsiteConfigStore>()(
  persist(
    (set, get) => ({
      title: "",
      mainTitle: "共享AI",
      subTitle: "",
      loginPageSubTitle: "",
      logoUrl: "",
    }),
    {
      name: StoreKey.WebsiteConfig,
      version: 1,
    },
  ),
);
