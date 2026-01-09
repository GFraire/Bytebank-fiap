import { MonthlySummaryDTO } from "@/application/dtos/monthly-summary-dto";
import { TransactionDTO } from "@/application/dtos/transaction-dto";
import { UserDTO } from "@/application/dtos/user-dto";
import {
  addTransactionUseCase,
  deleteTransactionUseCase,
  getMonthlySummariesUseCase,
  getTransactionsByUserUseCase,
  updateTransactionUseCase
} from "@/infra/container";
import { create } from "zustand";

interface AuthState {
  user: UserDTO | null;
  loading: boolean;
  transactions: TransactionDTO[] | null;
  lastTransactionDoc?: any;
  loadingTransactions: boolean;
  monthlySummaries: MonthlySummaryDTO[] | null;
  loadingMonthlySummaries: boolean;
  setUser: (user: UserDTO | null) => void;

  addTransaction: (
    transaction: Omit<TransactionDTO, "uid">
  ) => Promise<{ error: string | null }>;
  deleteTransaction: (
    transaction: TransactionDTO
  ) => Promise<{ error: string | null }>;
  updateTransaction: (
    transaction: TransactionDTO
  ) => Promise<{ error: string | null }>;
  getTransactions: () => Promise<{ error: string | null }>;
  loadMoreTransactions: () => Promise<{ error: string | null }>;
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

  // Clean
  addTransaction: async (transaction) => {
    set({ loading: true });

    try {
      const { transaction: newTransaction, userSummary } =
        await addTransactionUseCase.execute(transaction);

      useUserStore.setState((prevState) => ({
        user: { ...prevState.user!, ...userSummary },
        loading: false,
        transactions: prevState.transactions
          ? [newTransaction, ...prevState.transactions]
          : [newTransaction],
      }));

      await useUserStore.getState().getMonthlySummaries();

      return { error: null };
    } catch (error: any) {
      set({ loading: false });
      console.error(error.message);

      return { error: error.message };
    }
  },

  // Clean
  updateTransaction: async (transaction: TransactionDTO) => {
    const state = useUserStore.getState();

    const user = state.user;
    if (!user) return { error: "Usuário não autenticado." };

    set({ loading: true });

    try {
      const { transaction: updatedTransaction, userSummary } =
        await updateTransactionUseCase.execute(transaction);

      set((state) => ({
        transactions: state.transactions?.map((t) =>
          t.uid === updatedTransaction.uid ? updatedTransaction : t
        ),
        user: {
          ...user,
          totalIncome: userSummary.totalIncome,
          totalExpense: userSummary.totalExpense,
          balance: userSummary.balance,
        },
        loading: false,
      }));

      await useUserStore.getState().getMonthlySummaries();

      return { error: null };
    } catch (error: any) {
      set({ loading: false });
      return { error: error.message };
    }
  },

  // Clean
  deleteTransaction: async (transaction) => {
    set({ loading: true });

    const state = useUserStore.getState();

    const user = state.user;
    if (!user) return { error: "Usuário não autenticado." };

    try {
      const { transaction: deletedTransaction, userSummary } =
        await deleteTransactionUseCase.execute(transaction);

      // Remove transação localmente
      const updatedTransactions = state.transactions?.filter(
        (t) => t.uid !== deletedTransaction?.uid
      );

      set({
        transactions: updatedTransactions || [],
        loading: false,
        user: {
          ...user,
          totalIncome: userSummary.totalIncome,
          totalExpense: userSummary.totalExpense,
          balance: userSummary.balance,
        },
      });

      await useUserStore.getState().getMonthlySummaries();

      return { error: null };
    } catch (error: any) {
      set({ loading: false });

      return { error: error.message };
    }
  },

  // Clean
  getTransactions: async () => {
    const state = useUserStore.getState();
    const uid = state.user?.uid;

    if (!uid) return { error: "Usuário não autenticado." };

    set({ loadingTransactions: true });

    try {
      const { transactions, lastDoc } =
        await getTransactionsByUserUseCase.execute(uid, 6);

      set({
        transactions,
        lastTransactionDoc: lastDoc,
        loadingTransactions: false,
      });
      return { error: null };
    } catch (error: any) {
      set({ loadingTransactions: false });

      return { error: error.message };
    }
  },

  // Clean
  loadMoreTransactions: async () => {
    const state = useUserStore.getState();

    const uid = state.user?.uid;
    if (!uid) return { error: "Usuário não autenticado." };

    if (!state.lastTransactionDoc) return { error: null };

    set({ loadingTransactions: true });

    try {
      const { transactions: newTransactions, lastDoc } =
        await getTransactionsByUserUseCase.execute(
          uid,
          2,
          state.lastTransactionDoc
        );

      set({
        transactions: state.transactions
          ? [...state.transactions, ...newTransactions]
          : newTransactions,
        lastTransactionDoc: lastDoc,
        loadingTransactions: false,
      });

      return { error: null };
    } catch (error: any) {
      set({ loadingTransactions: false });

      return { error: error.message };
    }
  },

  // Clean
  getMonthlySummaries: async () => {
    const state = useUserStore.getState();

    const uid = state.user?.uid;
    if (!uid) return { error: "Usuário não autenticado." };

    set({ loadingMonthlySummaries: true });

    try {
      const summaries = await getMonthlySummariesUseCase.execute(uid);

      set({ monthlySummaries: summaries, loadingMonthlySummaries: false });

      return { error: null };
    } catch (error: any) {
      set({ loadingMonthlySummaries: false });

      return { error: error.message };
    }
  },
}));
