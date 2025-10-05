import { Colors } from "@/constants/theme";
import { ITransaction } from "@/hooks/useTransaction";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

interface IListItemProps {
  transaction: ITransaction;
}

export function ListItem({ transaction }: IListItemProps) {
  const color = transaction.flow === "income" ? Colors.green : Colors.error;

  const icon = transaction.flow === "income" ? "arrow-up" : "arrow-down";

  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(transaction.amount);

  const date = new Date(transaction.date);
  const formattedDate = date.toLocaleDateString("pt-BR");

  const signal = transaction.flow === "income" ? "+" : "-";

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemRow}>
        <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{transaction.description}</Text>
          <Text style={styles.subtitleText}>{transaction.category}</Text>
          <Text style={styles.subtitleText}>{formattedDate}</Text>
        </View>
      </View>

      <View style={styles.amountRow}>
        <Text style={[styles.amountText, { color }]}>
          {signal}
          {formattedValue}
        </Text>

        <Ionicons
          name="ellipsis-vertical"
          size={18}
          color={Colors["gray-500"]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    borderColor: Colors["gray-200"],
    borderTopWidth: 1,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    borderRadius: 8,
    padding: 4,
  },
  textContainer: {
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.black,
  },
  subtitleText: {
    fontSize: 13,
    color: Colors["gray-600"],
    fontFamily: "Inter_400Regular",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
  amountText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
});
