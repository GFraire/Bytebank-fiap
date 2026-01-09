import { Colors } from "@/constants/theme";
import { useSummariesStore } from "@/stores/monthly-summaries-store";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useMemo } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLegend,
  VictoryTooltip,
} from "victory-native";

export function TransactionChart() {
  const { summaries } = useSummariesStore();

  const chartData = useMemo(() => {
    if (!summaries || summaries.length === 0)
      return { labels: [], incomeData: [], expenseData: [] };

    // Ordena pelo mês (YYYY-MM)
    const sorted = [...summaries].sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    const labels = sorted.map((s) => {
      const [year, month] = s.month.split("-");
      const yearShort = year.slice(2);
      return `${Number(month)}/${yearShort}`;
    });

    const incomeData = sorted.map((s, i) => ({
      x: i + 1,
      y: s.totalIncome,
      label: `R$ ${s.totalIncome.toFixed(2)}`,
    }));

    const expenseData = sorted.map((s, i) => ({
      x: i + 1,
      y: s.totalExpense,
      label: `R$ ${s.totalExpense.toFixed(2)}`,
    }));

    return { labels, incomeData, expenseData };
  }, [summaries]);

  const { labels, incomeData, expenseData } = chartData;
  const maxY = Math.max(
    0,
    ...incomeData.map((d) => d.y),
    ...expenseData.map((d) => d.y)
  );

  // ✨ Animação de entrada
  const translateY = useSharedValue(1200);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useFocusEffect(
    useCallback(() => {
      translateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
      return () => {
        translateY.value = withTiming(300, {
          duration: 100,
          easing: Easing.in(Easing.cubic),
        });
      };
    }, [])
  );

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.title}>Receitas vs Despesas</Text>

      {labels.length === 0 ? (
        <Text style={styles.emptyText}>Sem dados para exibir</Text>
      ) : (
        <VictoryChart
          domainPadding={{ x: 20 }}
          domain={{ y: [0, maxY * 1.1] }}
          padding={{ top: 20, bottom: 28, left: 60, right: 60 }}
        >
          <VictoryAxis
            tickValues={incomeData.map((_, i) => i + 1)}
            tickFormat={labels}
          />
          <VictoryAxis dependentAxis tickFormat={(x) => `${x}`} />

          <VictoryGroup offset={15} colorScale={["#47A138", "#FF5031"]}>
            <VictoryBar
              data={incomeData}
              barWidth={10}
              labelComponent={<VictoryTooltip />}
            />
            <VictoryBar
              data={expenseData}
              barWidth={10}
              labelComponent={<VictoryTooltip />}
            />
          </VictoryGroup>

          <VictoryLegend
            x={80}
            y={0}
            orientation="horizontal"
            gutter={20}
            data={[
              { name: "Receitas", symbol: { fill: "#47A138" } },
              { name: "Despesas", symbol: { fill: "#FF5031" } },
            ]}
          />
        </VictoryChart>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors["gray-100"],
    borderRadius: 12,
    borderColor: Colors["gray-200"],
    borderWidth: 1,
  },
  title: {
    fontFamily: "Inter_700Bold",
    marginBottom: 5,
  },
  emptyText: {
    textAlign: "center",
    color: Colors["gray-300"],
    fontFamily: "Inter_500Medium",
    marginVertical: 20,
  },
});
