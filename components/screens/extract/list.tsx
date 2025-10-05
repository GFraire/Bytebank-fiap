import { Colors } from "@/constants/theme";
import { useToastStore } from "@/stores/toastStore";
import { useUserStore } from "@/stores/userStore";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View
} from "react-native";
import { ListItem } from "./list-item";


export function List() {
  const {
    transactions,
    getTransactions,
    loadMoreTransactions,
    loadingTransactions,
  } = useUserStore();

  const { addToast } = useToastStore();

  useEffect(() => {
    async function fetchData() {
      const { error } = await getTransactions();

      if (error) {
        addToast("Erro ao carregar transações " + error, "error");
      }
    }

    fetchData()
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transações</Text>

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
  title: {
    padding: 16,
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
});
