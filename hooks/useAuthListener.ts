import { getUserSummaryUseCase } from "@/infra/container";
import { auth } from "@/infra/firebase/config/firebase-config";
import { useUserStore } from "@/stores/userStore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

export function useAuthListener() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        useUserStore.setState({ user: null, loading: false });
        return;
      }

      const userSummary = await getUserSummaryUseCase.execute(firebaseUser.uid);

      if (!userSummary) {
        useUserStore.setState({
          user: null,
          loading: false,
          monthlySummaries: null,
          transactions: null,
        });
        return;
      }

      useUserStore.setState({
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "",
          balance: userSummary.balance,
          totalExpense: userSummary.totalExpense,
          totalIncome: userSummary.totalIncome,
        },
        loading: false,
      });

      await useUserStore.getState().getMonthlySummaries();
    });

    return () => unsubscribe(); // limpa listener ao desmontar
  }, []);
}
