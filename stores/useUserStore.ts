import { auth } from "@/firebaseConfig";
import { ITransaction, useTransaction } from "@/hooks/useTransaction";
import { useUserSummary } from "@/hooks/useUserSummary";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
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
  loading: boolean;
  transactions: ITransaction[] | null;
  setUser: (user: IUserData | null) => void;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  addTransaction: (
    transaction: ITransaction
  ) => Promise<{ error: string | null }>;
  getTransactions: () => Promise<{ error: string | null }>;
}

export const useUserStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  transactions: null,
  setUser: (user) => set({ user }),
  login: async (email, password) => {
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
  signUp: async (email, password, name) => {
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
  addTransaction: async (transaction) => {
    const { addTransaction } = useTransaction();
    const { updateUserSummary } = useUserSummary();

    const { error: addTransactionError } = await addTransaction(transaction);
    if (addTransactionError) return { error: addTransactionError };

    const state = useUserStore.getState();
    const uid = state.user?.uid;
    if (!uid) return { error: "Usuário não autenticado." };

    // Calcula os novos valores do resumo
    const prev = state.user;
    if (!prev) return { error: "Usuário não autenticado." };

    let newIncome = prev.totalIncome;
    let newExpense = prev.totalExpense;

    if (transaction.flow === "income") {
      newIncome += Number(transaction.amount);
    } else if (transaction.flow === "expense") {
      newExpense += Number(transaction.amount);
    }

    const newBalance = newIncome - newExpense;

    // Atualiza no Firestore
    const { userSummary, error } = await updateUserSummary(uid, {
      totalIncome: newIncome,
      totalExpense: newExpense,
      balance: newBalance,
    });

    if (userSummary) {
      // Atualiza o estado local da store
      useUserStore.setState((prevState) => ({
        user: { ...prevState.user!, ...userSummary },
        // Atualiza o array de transactions
        transactions: prevState.transactions
          ? [...prevState.transactions, transaction]
          : [transaction],
      }));
    }

    return { error: null };
  },
  getTransactions: async () => {
    const { getTransactionsByUser } = useTransaction();

    const state = useUserStore.getState();
    const uid = state.user?.uid;
    if (!uid) return { error: "Usuário não autenticado." };

    const { transactions, error } = await getTransactionsByUser(uid);

    if (!transactions) {
      return { error };
    }

    set({ transactions });

    return { error: null };
  },
  logout: async () => {
    await signOut(auth);
    set({ user: null });
    router.replace("/login");
  },
}));

onAuthStateChanged(auth, async (firebaseUser) => {
  if (!firebaseUser) {
    useUserStore.setState({ user: null, loading: false });
    return;
  }

  // Busca o resumo no Firestore
  const { getUserSummary } = useUserSummary();
  const userSummaryResult = await getUserSummary(firebaseUser.uid);

  if (!userSummaryResult.userSummary) {
    useUserStore.setState({ user: null, loading: false });
    return;
  }

  useUserStore.setState({
    user: {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName || "",
      balance: userSummaryResult.userSummary.balance,
      totalExpense: userSummaryResult.userSummary.totalExpense,
      totalIncome: userSummaryResult.userSummary.totalIncome,
    },
    loading: false,
  });
});
