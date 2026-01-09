import { MonthlySummaryDTO } from "@/application/dtos/monthly-summary-dto";
import { getMonthlySummariesUseCase } from "@/infra/container";
import { create } from "zustand";
import { useAuthStore } from "./auth-user-store";

interface SummariesState {
  summaries: MonthlySummaryDTO[] | null;
  loading: boolean;
  fetch: () => Promise<{ error: string | null }>;
  reset: () => void;
}

export const useSummariesStore = create<SummariesState>((set) => ({
  summaries: null,
  loading: false,

  fetch: async () => {
    const uid = useAuthStore.getState().user?.uid;
    if (!uid) return { error: "Usuário não autenticado." };

    set({ loading: true });

    try {
      const summaries = await getMonthlySummariesUseCase.execute(uid);

      set({ summaries, loading: false });

      return { error: null };
    } catch (error: any) {
      set({ loading: false });

      return { error: error.message };
    }
  },

  reset: () => set({ summaries: null, loading: false }),
}));
