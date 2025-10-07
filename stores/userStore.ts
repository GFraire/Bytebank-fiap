import { auth } from "@/firebaseConfig";
import {
  IMonthlySummary,
  ITransaction,
  useTransaction,
} from "@/hooks/useTransaction";
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
  monthlySummaries: IMonthlySummary[] | null;
  loadingMonthlySummaries: boolean;
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
  deleteTransaction: (
    transaction: ITransaction
  ) => Promise<{ error: string | null }>;
  updateTransaction: (
    transaction: ITransaction
  ) => Promise<{ error: string | null }>;
  getTransactions: () => Promise<{ error: string | null }>;
  loadMoreTransactions: () => Promise<void>;
  getMonthlySummaries: () => Promise<{ error: string | null }>;
}

export const useUserStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  transactions: null,
  lastTransactionDoc: undefined,
  loadingTransactions: false,
  monthlySummaries: null,
  loadingMonthlySummaries: false,

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

      await useUserStore.getState().getMonthlySummaries();

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
          ? [newTransaction, ...prevState.transactions]
          : [newTransaction],
      }));
    }

    await useUserStore.getState().getMonthlySummaries();
    return { error: null };
  },

  updateTransaction: async (transaction: ITransaction) => {
    const { updateTransaction } = useTransaction();
    const { updateUserSummary } = useUserSummary();

    const state = useUserStore.getState();
    const user = state.user;
    if (!user) return { error: "Usuário não autenticado." };

    set({ loading: true });

    // Encontra a transação antiga no estado
    const oldTransaction = state.transactions?.find(
      (t) => t.uid === transaction.uid
    );

    if (!oldTransaction) {
      set({ loading: false });
      return { error: "Transação não encontrada." };
    }

    // Atualiza no Firebase
    const { transaction: updatedTransaction, error: updateError } =
      await updateTransaction(transaction);

    if (updateError) {
      set({ loading: false });
      return { error: updateError };
    }

    // Calcula as diferenças para atualizar o resumo do usuário
    let newIncome = user.totalIncome;
    let newExpense = user.totalExpense;

    // Subtrai os valores antigos
    if (oldTransaction.flow === "income") newIncome -= oldTransaction.amount;
    if (oldTransaction.flow === "expense") newExpense -= oldTransaction.amount;

    if (!updatedTransaction) {
      set({ loading: false });

      return { error: "Transação a ser atualizada não encontrada" };
    }

    // Soma os valores novos
    if (updatedTransaction.flow === "income")
      newIncome += updatedTransaction.amount;
    if (updatedTransaction.flow === "expense")
      newExpense += updatedTransaction.amount;

    const newBalance = newIncome - newExpense;

    // Atualiza o resumo do usuário
    await updateUserSummary(user.uid, {
      totalIncome: newIncome,
      totalExpense: newExpense,
      balance: newBalance,
    });

    // Atualiza a transação localmente
    const updatedTransactions = state.transactions?.map((t) =>
      t.uid === updatedTransaction.uid ? updatedTransaction : t
    );

    set({
      transactions: updatedTransactions || [],
      user: {
        ...user,
        totalIncome: newIncome,
        totalExpense: newExpense,
        balance: newBalance,
      },
      loading: false,
    });

    // Atualiza os monthly summaries
    await useUserStore.getState().getMonthlySummaries();

    return { error: null };
  },

  deleteTransaction: async (transaction) => {
    set({ loading: true });

    const { deleteTransaction } = useTransaction();
    const { updateUserSummary } = useUserSummary();

    const state = useUserStore.getState();
    const user = state.user;
    if (!user) return { error: "Usuário não autenticado." };

    const { error: deleteError } = await deleteTransaction(transaction);

    if (deleteError) {
      set({ loading: false });
      return { error: deleteError };
    }

    let newIncome = user.totalIncome;
    let newExpense = user.totalExpense;

    if (transaction.flow === "income") newIncome -= Number(transaction.amount);
    if (transaction.flow === "expense")
      newExpense -= Number(transaction.amount);

    const newBalance = newIncome - newExpense;

    await updateUserSummary(user.uid, {
      totalIncome: newIncome,
      totalExpense: newExpense,
      balance: newBalance,
    });

    // Remove transação localmente
    const updatedTransactions = state.transactions?.filter(
      (t) => t.uid !== transaction.uid
    );

    set({
      transactions: updatedTransactions || [],
      loading: false,
      user: {
        ...user,
        totalIncome: newIncome,
        totalExpense: newExpense,
        balance: newBalance,
      },
    });

    await useUserStore.getState().getMonthlySummaries();

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

  getMonthlySummaries: async () => {
    const { getMonthlySummaries } = useTransaction();

    const state = useUserStore.getState();
    const uid = state.user?.uid;
    if (!uid) return { error: "Usuário não autenticado." };

    set({ loadingMonthlySummaries: true });

    try {
      const summaries = await getMonthlySummaries(uid);

      set({ monthlySummaries: summaries, loadingMonthlySummaries: false });
      return { error: null };
    } catch (error: any) {
      set({ loadingMonthlySummaries: false });
      return { error: error.message };
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

  await useUserStore.getState().getMonthlySummaries();
});
