import { TransactionDTO } from "@/application/dtos/transaction-dto";
import {
  addTransactionUseCase,
  deleteTransactionUseCase,
  getTransactionsByUserUseCase,
  updateTransactionUseCase,
} from "@/infra/container";
import { create } from "zustand";
import { useAuthStore } from "./auth-user-store";
import { useSummariesStore } from "./monthly-summaries-store";

interface TransactionsState {
  transactions: TransactionDTO[] | null;
  lastTransactionDoc?: any;
  loading: boolean;
  fetch: () => Promise<{ error: string | null }>;
  loadMore: () => Promise<{ error: string | null }>;
  add: (transaction: Omit<TransactionDTO, "uid">) => Promise<{
    error: string | null;
  }>;
  update: (transaction: TransactionDTO) => Promise<{
    error: string | null;
  }>;
  remove: (transaction: TransactionDTO) => Promise<{
    error: string | null;
  }>;
  reset: () => void;
}

export const useTransactionsStore = create<TransactionsState>((set, get) => ({
  transactions: null,
  lastTransactionDoc: undefined,
  loading: false,

  fetch: async () => {
    const uid = useAuthStore.getState().user?.uid;
    if (!uid) return { error: "Usuário não autenticado." };

    set({ loading: true });

    try {
      const { transactions, lastDoc } =
        await getTransactionsByUserUseCase.execute(uid, 6);

      set({ transactions, lastTransactionDoc: lastDoc, loading: false });

      return { error: null };
    } catch (error: any) {
      set({ loading: false });
      return { error: error.message };
    }
  },

  loadMore: async () => {
    const uid = useAuthStore.getState().user?.uid;
    if (!uid || !get().lastTransactionDoc) return { error: null };

    set({ loading: true });

    try {
      const { transactions: newTransactions, lastDoc } =
        await getTransactionsByUserUseCase.execute(
          uid,
          2,
          get().lastTransactionDoc
        );

      set((state) => {
        const map = new Map<string, TransactionDTO>();

        [...(state.transactions ?? []), ...newTransactions].forEach((t) => {
          map.set(t.uid, t);
        });

        return {
          transactions: Array.from(map.values()),
          lastTransactionDoc: lastDoc,
          loading: false,
        };
      });

      return { error: null };
    } catch (error: any) {
      set({ loading: false });

      return { error: error.message };
    }
  },

  add: async (transaction) => {
    set({ loading: true });

    try {
      const { transaction: newTransaction, userSummary } =
        await addTransactionUseCase.execute(transaction);

      useAuthStore.getState().updateSummary(userSummary);

      await useSummariesStore.getState().fetch();

      set((state) => ({
        transactions: state.transactions
          ? [...state.transactions, newTransaction]
          : [newTransaction],
      }));

      set({ loading: false });

      return { error: null };
    } catch (error: any) {
      set({ loading: false });

      return { error: error.message };
    }
  },

  update: async (transaction) => {
    set({ loading: true });

    try {
      const { transaction: updatedTransaction, userSummary } =
        await updateTransactionUseCase.execute(transaction);

      useAuthStore.getState().updateSummary(userSummary);

      await useSummariesStore.getState().fetch();

      set((state) => ({
        transactions: state.transactions?.map((t) =>
          t.uid === updatedTransaction.uid ? updatedTransaction : t
        ),
      }));

      set({ loading: false });

      return { error: null };
    } catch (error: any) {
      set({ loading: false });

      return { error: error.message };
    }
  },

  remove: async (transaction) => {
    try {
      set({ loading: true });

      const { transaction: deletedTransaction, userSummary } =
        await deleteTransactionUseCase.execute(transaction);

      useAuthStore.getState().updateSummary(userSummary);

      await useSummariesStore.getState().fetch();

      set((state) => ({
        transactions: state.transactions?.filter(
          (t) => t.uid !== deletedTransaction?.uid
        ),
      }));

      set({ loading: false });

      return { error: null };
    } catch (error: any) {
      set({ loading: false });

      return { error: error.message };
    }
  },

  reset: () =>
    set({ transactions: null, lastTransactionDoc: undefined, loading: false }),
}));
