import { Roles } from "@/prisma/generated/enums";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ZustandUser = {
  image?: string;
  email: string;
  role: Roles;
  name: string;
};

type UserStore = {
  user: ZustandUser | null;
  setUser: (user: ZustandUser) => void;
  clearUser: () => void;
};

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,

      setUser: (user) => set({ user }),

      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-store",
    },
  ),
);
