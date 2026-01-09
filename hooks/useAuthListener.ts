import { auth } from "@/infra/firebase/config/firebase-config";
import { useAuthStore } from "@/stores/auth-user-store";
import { useSummariesStore } from "@/stores/monthly-summaries-store";
import { useTransactionsStore } from "@/stores/transactions-store";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";

export function useAuthListener() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const authStore = useAuthStore.getState();
      const summariesStore = useSummariesStore.getState();
      const transactionsStore = useTransactionsStore.getState();

      if (firebaseUser) {
        await authStore.bootstrapUser(
          firebaseUser.uid,
          firebaseUser.email ?? "",
          firebaseUser.displayName ?? ""
        );

        await summariesStore.fetch()

        router.replace("/(tabs)/dashboard");
      } else {
        authStore.reset();
        summariesStore.reset();
        transactionsStore.reset();

        router.replace("/login");
      }

      authStore.finishInit();
    });

    return () => unsubscribe(); // limpa listener ao desmontar
  }, []);
}
