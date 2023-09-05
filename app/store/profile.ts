import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StoreKey } from "../constant";

export interface Member {
  id: string;
  memberCard: string;
  expirationTime: string;
  points: number;
  usablePoints: number;
  levelName: string;
  memberTypeName: string;
  isRenew: boolean;
  expirationTimeText: string;
}

export interface ProfileStore {
  member: Member | null;
  setMember: (member: Member) => void;
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      member: null,
      setMember(data) {
        set(() => ({
          member: data,
        }));
      },
    }),
    {
      name: StoreKey.Profile,
      version: 1,
    },
  ),
);
