import { Header } from "@/components/header";
import { Summary } from "@/components/screens/dashboard/summary";
import { TransactionChart } from "@/components/screens/dashboard/transaction-chart";
import { Colors } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

      <Header
        description="Visão geral de suas finanças"
        icon="bar-chart-outline"
        title="Dashboard"
      />

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.content}>
          <Summary />

          <TransactionChart />
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
    gap: 16,
  },
});
