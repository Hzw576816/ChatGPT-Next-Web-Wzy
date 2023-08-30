import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKey } from "../constant";
import { CallResult, requestLogin } from "../requests";
import { useChatStore } from "@/app/store/chat";

export interface AuthStore {
  token: string;
  username: string;
  // inviteCode: string,//邀请码
  avatar: string; //头像
  user: any;
  clean: () => void;
  login: (username: string, password: string) => Promise<any>;
  logout: () => void;
  setLogin: (result: CallResult) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      name: "",
      token: "",
      username: "",
      avatar: "",
      user: null,
      async login(username: string, password: string) {
        let result: any = await requestLogin(username, password, {
          onError: (err) => {
            console.error(err);
          },
        });

        if (result.code === 0) {
          set(() => ({
            username: result.data.user.userName,
            token: result.data.token || "",
            user: result.data.user,
            avatar: result.data.user.extraProperties.AvatarUrl,
          }));
        }

        return result;
      },
      logout() {
        get().clean();
      },
      clean() {
        set(() => ({
          name: "",
          token: "",
          username: "",
          avatar: "",
          user: null,
        }));
        useChatStore.getState().resetSession();
      },
      setLogin(result: CallResult) {
        set(() => ({
          username: result.data.user.userName,
          token: result.data.token || "",
          user: result.data.user,
          avatar: result.data.user.extraProperties.AvatarUrl,
        }));
      },
    }),
    {
      name: StoreKey.Auth,
      version: 1,
    },
  ),
);
