import { create } from "zustand";

interface IUserData {
  uid: string;
  email: string;
  displayName: string;
}

interface AuthState {
  user: IUserData | null;
  setUser: (user: IUserData | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
