import { TransactionDTO } from "@/application/dtos/transaction-dto";
import { Header } from "@/ui/components/header";
import { List } from "@/ui/components/screens/extract/list";
import { TransactionFilterModal } from "@/ui/components/screens/extract/transaction-filter";
import { Colors } from "@/ui/constants/theme";
import { useToastStore } from "@/ui/stores/toastStore";
import { useTransactionsStore } from "@/ui/stores/transactions-store";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Extract() {
  const { transactions, fetch } = useTransactionsStore();
  const [filteredTransactions, setFilteredTransactions] = useState<
    TransactionDTO[]
  >(transactions || []);
  const [filterVisible, setFilterVisible] = useState(false);
  const { addToast } = useToastStore();

  const translateY = useSharedValue(1300);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  // Faz a animação sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      translateY.value = withTiming(0, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      });

      return () => {
        // ao perder o foco, volta pra baixo
        translateY.value = withTiming(1000, {
          duration: 200,
          easing: Easing.in(Easing.exp),
        });
      };
    }, [])
  );

  useEffect(() => {
    async function fetchData() {
      const { error } = await fetch();
      if (error) addToast("Erro ao carregar transações " + error, "error");
    }
    fetchData();
  }, []);

  useEffect(() => {
    setFilteredTransactions(transactions || []);
  }, [transactions]);

  function handleFilter(filters: any) {
    let result: TransactionDTO[] = [...(transactions || [])];

    if (filters.description) {
      result = result.filter((t) =>
        t.description.toLowerCase().includes(filters.description.toLowerCase())
      );
    }

    if (filters.type) {
      result = result.filter((t) => t.type === filters.type);
    }

    if (filters.category) {
      result = result.filter((t) => t.category === filters.category);
    }

    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      result = result.filter((t) => {
        const tDate = new Date(t.date);
        return tDate >= start && tDate <= end;
      });
    }

    setFilteredTransactions(result);
    setFilterVisible(false);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

      <Header
        description="Histórico completo de suas transações"
        icon="document-text-outline"
        title="Transações"
      />

      <Animated.View style={[styles.content, animatedStyle]}>
        <List
          transactions={filteredTransactions}
          onFilterPress={() => setFilterVisible(true)}
        />
      </Animated.View>

      <TransactionFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onFilter={handleFilter}
      />
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
    flex: 1,
  },
});
