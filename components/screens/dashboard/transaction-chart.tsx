import { Colors } from "@/constants/theme";
import { useUserStore } from "@/stores/userStore";
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
  const { transactions } = useUserStore();

  // Processa os dados
  const chartData = useMemo(() => {
    const monthlyData: Record<string, { income: number; expense: number }> = {};

    transactions?.forEach((t) => {
      const date = new Date(t.date);
      const yearShort = String(date.getFullYear()).slice(-2); // pega os dois últimos dígitos
      const monthYear = `${date.getMonth() + 1}/${yearShort}`;

      if (!monthlyData[monthYear])
        monthlyData[monthYear] = { income: 0, expense: 0 };

      if (t.flow === "income") monthlyData[monthYear].income += t.amount;
      else monthlyData[monthYear].expense += t.amount;
    });

    const monthlyArray = Object.entries(monthlyData).map(
      ([monthYear, data]) => {
        const [month, year] = monthYear.split("/").map(Number);
        return {
          monthYear,
          income: data.income,
          expense: data.expense,
          date: new Date(year, month - 1, 1),
        };
      }
    );

    monthlyArray.sort((a, b) => a.date.getTime() - b.date.getTime());

    const labels = monthlyArray.map((d) => d.monthYear);

    const incomeData = monthlyArray.map((d, i) => ({
      x: i + 1,
      y: d.income,
      label: `R$ ${d.income}`,
    }));

    const expenseData = monthlyArray.map((d, i) => ({
      x: i + 1,
      y: d.expense,
      label: `R$ ${d.expense}`,
    }));

    return { labels, incomeData, expenseData };
  }, [transactions]);

  const { labels, incomeData, expenseData } = chartData;
  const maxY = Math.max(
    ...incomeData.map((d) => d.y),
    ...expenseData.map((d) => d.y)
  );

  const translateY = useSharedValue(1200);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useFocusEffect(
    useCallback(() => {
      // Entra de baixo pra cima
      translateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });

      return () => {
        // Volta pra baixo ao sair
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
});
