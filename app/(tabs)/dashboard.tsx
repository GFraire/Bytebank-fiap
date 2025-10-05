import { Header } from "@/components/header";
import { Summary } from "@/components/screens/dashboard/summary";
import { Colors } from "@/constants/theme";
import { ITransaction, useTransaction } from "@/hooks/useTransaction";
import { useUserStore } from "@/stores/useUserStore";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [transactions, setTransactions] = useState([] as ITransaction[]);

  const { user } = useUserStore();
  const { getTransactionsByUser } = useTransaction();

  useEffect(() => {
    async function fetchTransactions() {
      if (!user?.uid) return;

      const data = await getTransactionsByUser(user?.uid);
      setTransactions(data);
    }

    fetchTransactions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Header
        description="Visão geral de suas finanças"
        icon="bar-chart-sharp"
        title="Dashboard"
      />

      <Summary />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
