import { auth } from "@/firebaseConfig";
import { useUserSummary } from "@/hooks/useUserSummary";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { create } from "zustand";

interface IUserData {
  uid: string;
  email: string;
  displayName: string;
  totalExpense: number;
  totalIncome: number;
  balance: number;
}

interface AuthState {
  user: IUserData | null;
  setUser: (user: IUserData | null) => void;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error: string | null }>;
  logout: () => void;
}

export const useUserStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  login: async (email: string, password: string) => {
    const { getUserSummary } = useUserSummary();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userSummaryResult = await getUserSummary(userCredential.user.uid);

      if (!userSummaryResult.userSummary)
        return { error: userSummaryResult.error };

      const user: IUserData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email as string,
        displayName: userCredential.user.displayName as string,
        balance: userSummaryResult.userSummary.balance,
        totalExpense: userSummaryResult.userSummary.totalExpense,
        totalIncome: userSummaryResult.userSummary.totalIncome,
      };

      set({ user });

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },
  signUp: async (email: string, password: string, name: string) => {
    const { addUserSummary } = useUserSummary();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      const userSummaryResult = await addUserSummary(userCredential.user.uid);

      if (userSummaryResult.error) return { error: userSummaryResult.error };

      const user: IUserData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email as string,
        displayName: userCredential.user.displayName as string,
        balance: 0,
        totalExpense: 0,
        totalIncome: 0,
      };

      set({ user });

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  },
  logout: async () => {
    const router = useRouter();
    await signOut(auth);

    set({ user: null });
    router.replace("/");
  },
}));
