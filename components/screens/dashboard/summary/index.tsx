import { IconDollar } from "@/components/icons";
import { Colors } from "@/constants/theme";
import { useUserStore } from "@/stores/userStore";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Card from "./card";

export function Summary() {
  const { user } = useUserStore();
  const balance = user?.balance || 0;
  const income = user?.totalIncome || 0;
  const expense = user?.totalExpense || 0;

  const translateValues = [
    useSharedValue(-550),
    useSharedValue(-550),
    useSharedValue(-550),
  ];

  const animatedStyles = translateValues.map((tv) =>
    useAnimatedStyle(() => ({
      transform: [{ translateY: tv.value }],
    }))
  );

  const animateIn = () => {
    translateValues.forEach((tv, i) => {
      tv.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });
    });
  };

  const animateOut = () => {
    translateValues.forEach((tv, i) => {
      tv.value = withTiming(-550, {
        duration: 100,
        easing: Easing.in(Easing.cubic),
      });
    });
  };

  useFocusEffect(
    useCallback(() => {
      animateIn(); // Anima quando entra na tela

      return () => {
        animateOut(); // Anima para cima quando sai da tela
      };
    }, [])
  );

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyles[0]}>
        <Card
          type="total"
          title="Saldo total"
          icon={<IconDollar color="blue" />}
          value={balance}
        />
      </Animated.View>

      <Animated.View style={animatedStyles[1]}>
        <Card
          type="income"
          title="Receitas"
          icon={<Ionicons color={Colors.green} name="arrow-up" size={18} />}
          value={income}
        />
      </Animated.View>

      <Animated.View style={animatedStyles[2]}>
        <Card
          type="expense"
          title="Despesas"
          icon={<Ionicons color={Colors.error} name="arrow-down" size={18} />}
          value={expense}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
});
