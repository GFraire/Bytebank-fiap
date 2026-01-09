import { UserDTO } from "@/application/dtos/user-dto";
import { UserSummaryDTO } from "@/application/dtos/user-summary-dto";
import {
  getUserSummaryUseCase,
  loginUserUseCase,
  logoutUserUseCase,
  signUpUserUseCase,
} from "@/infra/container";
import { router } from "expo-router";
import { create } from "zustand";

interface AuthState {
  user: UserDTO | null;
  loading: boolean;
  initializing: boolean;
  finishInit: () => void;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  bootstrapUser: (
    uid: string,
    email: string,
    displayName: string
  ) => Promise<void>;
  updateSummary: (summary: UserSummaryDTO) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initializing: true,

  finishInit: () => set({ initializing: false }),

  login: async (email, password) => {
    set({ loading: true });

    try {
      const user = await loginUserUseCase.execute({ email, password });

      set({ user, loading: false });

      return { error: null };
    } catch (error: any) {
      set({ loading: false });

      return { error: error.message };
    }
  },

  signUp: async (email, password, name) => {
    set({ loading: true });

    try {
      const user = await signUpUserUseCase.execute({ email, password, name });

      set({ user, loading: false });

      return { error: null };
    } catch (error: any) {
      set({ loading: false });

      return { error: error.message };
    }
  },

  logout: async () => {
    await logoutUserUseCase.execute();

    set({ user: null });

    router.replace("/login");
  },

  bootstrapUser: async (uid: string, email: string, displayName: string) => {
    set({ loading: true });

    const summary = await getUserSummaryUseCase.execute(uid);

    set({
      user: {
        uid: uid,
        email: email,
        displayName: displayName,
        balance: summary?.balance || 0,
        totalIncome: summary?.totalIncome || 0,
        totalExpense: summary?.totalExpense || 0,
      },
      loading: false,
    });
  },

  updateSummary: (summary: UserSummaryDTO) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...summary } : null,
    })),

  reset() {
    set({ user: null, loading: false });
  },
}));
