import { Colors } from "@/constants/theme";
import { LinearGradient } from "expo-linear-gradient";
import React, { ReactElement } from "react";
import { StyleSheet, Text, View } from "react-native";

interface ICardProps {
  value: number;
  type: "income" | "expense" | "total";
  icon: ReactElement;
  title: string;
}

export default function Card({ type, icon, title, value }: ICardProps) {
  const color =
    type === "income" ? "green" : type === "expense" ? "error" : "blue";

  const gradient1 =
    type === "income" ? "#f0fdf4" : type === "expense" ? "#fee2e2" : "#eff6ff";

  const gradient2 =
    type === "income" ? "#dcfce7" : type === "expense" ? "#fecaca" : "#dbeafe";

  const formattedValue = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <LinearGradient
      colors={[gradient1, gradient2]}
      style={[styles.container, { borderLeftColor: Colors[color] }]}
    >
      <View style={styles.content}>
        <View>
          <Text style={[styles.title, { color: Colors[color] }]}>{title}</Text>

          <Text style={[styles.currency, { color: Colors[color] }]}>
            {formattedValue}
          </Text>
        </View>

        <View style={[styles.iconWrapper, { backgroundColor: gradient2 }]}>
          {icon}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,

    // sombra iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // sombra Android
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  currency: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",

    // sombra iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,

    // sombra Android
    elevation: 2,
  },
});
