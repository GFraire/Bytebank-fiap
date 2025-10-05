import { Header } from "@/components/header";
import { Summary } from "@/components/screens/dashboard/summary";
import { TransactionChart } from "@/components/screens/dashboard/transaction-chart";
import { Colors } from "@/constants/theme";
import { ITransaction, useTransaction } from "@/hooks/useTransaction";
import { useUserStore } from "@/stores/useUserStore";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const [transactions, setTransactions] = useState<ITransaction[] | null>(
    [] as ITransaction[]
  );

  const { user } = useUserStore();
  const { getTransactionsByUser } = useTransaction();

  useEffect(() => {
    async function fetchTransactions() {
      if (!user?.uid) return;

      const { transactions, error } = await getTransactionsByUser(user?.uid);

      if (!transactions) console.error(error);

      setTransactions(transactions);
    }

    fetchTransactions();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="dark" />

      <Header
        description="Visão geral de suas finanças"
        icon="bar-chart-sharp"
        title="Dashboard"
      />

      <ScrollView style={{ flex: 1 }} >
        <View style={styles.content}>
          <Summary />

          <TransactionChart transactions={transactions || []} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    padding: 16,
    gap: 16
  },
});
