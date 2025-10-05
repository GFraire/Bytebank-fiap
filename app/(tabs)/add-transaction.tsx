import { Header } from "@/components/header";
import TransactionForm from "@/components/screens/add-transaction/transaction-form";
import { Colors } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AddTransaction() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Header
        description="Adicione uma nova movimentação"
        icon="cash-outline"
        title="Nova transação"
      />

      <TransactionForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
