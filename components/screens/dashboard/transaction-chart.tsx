import { Colors } from "@/constants/theme";
import { ITransaction } from "@/hooks/useTransaction";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryGroup,
  VictoryLegend,
  VictoryTooltip,
} from "victory-native";

interface ITransactionChartProps {
  transactions: ITransaction[];
}

export function TransactionChart({ transactions }: ITransactionChartProps) {
  // Processa os dados
  const chartData = useMemo(() => {
    const monthlyData: Record<string, { income: number; expense: number }> = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const yearShort = String(date.getFullYear()).slice(-2); // pega os dois últimos dígitos
      const monthYear = `${date.getMonth() + 1}/${yearShort}`;

      if (!monthlyData[monthYear])
        monthlyData[monthYear] = { income: 0, expense: 0 };

      if (t.flow === "income") monthlyData[monthYear].income += t.amount;
      else monthlyData[monthYear].expense += t.amount;
    });

    // Converte para array e adiciona data real para ordenar
    const monthlyArray = Object.entries(monthlyData).map(
      ([monthYear, data]) => {
        const [month, year] = monthYear.split("/").map(Number);

        return {
          monthYear,
          income: data.income,
          expense: data.expense,
          date: new Date(year, month - 1, 1), // primeiro dia do mês
        };
      }
    );

    // Ordena por data
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

  return (
    <View style={styles.container}>
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
    </View>
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
