import { Colors } from "@/constants/theme";
import { ITransaction } from "@/hooks/useTransaction";
import { useUserStore } from "@/stores/userStore";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ListItem } from "./list-item";

interface IListProps {
  transactions: ITransaction[] | null;
  onFilterPress: () => void; // adiciona callback para abrir modal
}

export function List({ transactions, onFilterPress }: IListProps) {
  const { loadMoreTransactions, loadingTransactions } = useUserStore();

  return (
    <View style={styles.container}>
      {/* Header da lista com título e ícone */}
      <View style={styles.listHeader}>
        <Text style={styles.title}>Transações</Text>

        <TouchableOpacity
          onPress={onFilterPress}
          style={styles.filterIconButton}
        >
          <Ionicons name="filter-outline" size={24} color={Colors["gray-600"]} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => <ListItem transaction={item} />}
        onEndReached={loadMoreTransactions}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() =>
          loadingTransactions ? (
            <ActivityIndicator color={Colors.primary} size="small" />
          ) : null
        }
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 16 }}>
            Nenhuma transação encontrada
          </Text>
        }
        contentContainerStyle={{ padding: 0 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors["gray-100"],
    borderRadius: 12,
    borderColor: Colors["gray-200"],
    borderWidth: 1,
    flex: 1,
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  filterIconButton: {
    padding: 4,
    backgroundColor: Colors["gray-300"],
    borderRadius: 8
  },
});
