import { IconDollar } from "@/components/icons";
import { Colors } from "@/constants/theme";
import { useUserStore } from "@/stores/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";

import Card from "./card";

export function Summary() {
  const { user } = useUserStore();

  const balance = user?.balance || 0;
  const income = user?.totalIncome || 0;
  const expense = user?.totalExpense || 0;

  return (
    <View style={styles.container}>
      <Card
        type="total"
        title="Saldo total"
        icon={<IconDollar color="blue" />}
        value={balance}
      />

      <Card
        type="income"
        title="Receitas"
        icon={<Ionicons color={Colors.green} name="arrow-up" size={18} />}
        value={income}
      />

      <Card
        type="expense"
        title="Despesas"
        icon={<Ionicons color={Colors.error} name="arrow-down" size={18} />}
        value={expense}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    padding: 16,
  },
});
