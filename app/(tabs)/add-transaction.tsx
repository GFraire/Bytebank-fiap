import { Header } from "@/ui/components/header";
import TransactionForm from "@/ui/components/screens/add-transaction/transaction-form";
import { Colors } from "@/ui/constants/theme";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import { Dimensions, StyleSheet } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function AddTransaction() {
  const translateY = useSharedValue(SCREEN_HEIGHT); // começa fora da tela

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  useFocusEffect(
    useCallback(() => {
      // Ao entrar na tela: anima de baixo pra cima
      translateY.value = withTiming(0, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
      });

      // Ao sair da tela: anima para baixo de novo
      return () => {
        translateY.value = withTiming(SCREEN_HEIGHT, {
          duration: 100,
          easing: Easing.in(Easing.cubic),
        });
      };
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Header
        description="Adicione uma nova movimentação"
        icon="cash-outline"
        title="Nova transação"
      />

      <Animated.View style={[animatedStyle, { flex: 1 }]}>
        <TransactionForm />
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
