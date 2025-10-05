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
  lastTransactionDoc?: any;
  loadingTransactions: boolean;
  setUser: (user: IUserData | null) => void;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  addTransaction: (
    transaction: Omit<ITransaction, "uid">
  ) => Promise<{ error: string | null }>;
  getTransactions: () => Promise<{ error: string | null }>;
  loadMoreTransactions: () => Promise<void>;
}

export const useUserStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  transactions: null,
  lastTransactionDoc: undefined,
  loadingTransactions: false,

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    set({ loading: true });

    const { getUserSummary } = useUserSummary();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userSummaryResult = await getUserSummary(userCredential.user.uid);

      if (!userSummaryResult.userSummary) {
        set({ loading: false });
        return { error: userSummaryResult.error };
      }

      const user: IUserData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email as string,
        displayName: userCredential.user.displayName as string,
        balance: userSummaryResult.userSummary.balance,
        totalExpense: userSummaryResult.userSummary.totalExpense,
        totalIncome: userSummaryResult.userSummary.totalIncome,
      };

      set({ user, loading: false });
      return { error: null };
    } catch (error: any) {
      set({ loading: false });
      return { error: error.message };
    }
  },

  signUp: async (email, password, name) => {
    set({ loading: true });

    const { addUserSummary } = useUserSummary();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, { displayName: name });
      const userSummaryResult = await addUserSummary(userCredential.user.uid);

      if (userSummaryResult.error) {
        set({ loading: false });
        return { error: userSummaryResult.error };
      }

      const user: IUserData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email as string,
        displayName: userCredential.user.displayName as string,
        balance: 0,
        totalExpense: 0,
        totalIncome: 0,
      };

      set({ user, loading: false });
      return { error: null };
    } catch (error: any) {
      set({ loading: false });
      return { error: error.message };
    }
  },

  addTransaction: async (transaction) => {
    set({ loading: true });
    const { addTransaction } = useTransaction();
    const { updateUserSummary } = useUserSummary();

    const state = useUserStore.getState();
    const userUid = state.user?.uid;
    if (!userUid) return { error: "Usuário não autenticado." };

    const { transaction: newTransaction, error: addTransactionError } =
      await addTransaction(transaction);
    if (addTransactionError) {
      set({ loading: false });
      return { error: addTransactionError };
    }

    const prev = state.user!;
    let newIncome = prev.totalIncome;
    let newExpense = prev.totalExpense;

    if (newTransaction.flow === "income")
      newIncome += Number(newTransaction.amount);
    if (newTransaction.flow === "expense")
      newExpense += Number(newTransaction.amount);

    const newBalance = newIncome - newExpense;

    const { userSummary, error: userSummaryerror } = await updateUserSummary(
      userUid,
      {
        totalIncome: newIncome,
        totalExpense: newExpense,
        balance: newBalance,
      }
    );

    if (userSummaryerror) {
      set({ loading: false });
      return { error: userSummaryerror };
    }

    if (userSummary) {
      useUserStore.setState((prevState) => ({
        user: { ...prevState.user!, ...userSummary },
        loading: false,
        transactions: prevState.transactions
          ? [...prevState.transactions, newTransaction]
          : [newTransaction],
      }));
    }

    return { error: null };
  },

  getTransactions: async () => {
    const { getTransactionsByUser } = useTransaction();

    const state = useUserStore.getState();
    const uid = state.user?.uid;

    if (!uid) return { error: "Usuário não autenticado." };

    set({ loadingTransactions: true });

    const { transactions, lastDoc, error } = await getTransactionsByUser(
      uid,
      10
    );
    
    if (error) {
      set({ loadingTransactions: false });
      console.log(error);
      
      return { error };
    }

    set({
      transactions,
      lastTransactionDoc: lastDoc,
      loadingTransactions: false,
    });
    return { error: null };
  },

  loadMoreTransactions: async () => {
    const { getTransactionsByUser } = useTransaction();

    const state = useUserStore.getState();
    const uid = state.user?.uid;
    if (!uid || !state.lastTransactionDoc) return;

    set({ loadingTransactions: true });

    const {
      transactions: newTransactions,
      lastDoc,
      error,
    } = await getTransactionsByUser(uid, 10, state.lastTransactionDoc);


    if (!error) {
      set({
        transactions: state.transactions
          ? [...state.transactions, ...newTransactions]
          : newTransactions,
        lastTransactionDoc: lastDoc,
        loadingTransactions: false,
      });
    } else {
      set({ loadingTransactions: false });
    }
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
