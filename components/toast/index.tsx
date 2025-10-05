import { Colors } from "@/constants/theme";
import { useToastStore } from "@/stores/toastStore";
import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ToastItemProps {
  toast: {
    id: number;
    message: string;
    type: "success" | "error" | "info";
  };
  onHide?: () => void; // callback quando a animação terminar
}

export function ToastItem({ toast, onHide }: ToastItemProps) {
  const removeToast = useToastStore.getState().removeToast; // só existe em modo global

  const hide = () => {
    if (onHide) {
      onHide();
    } else {
      removeToast(toast.id);
    }
  };

  // no final da animação:

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-30);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
    translateY.value = withTiming(0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });

    const timer = setTimeout(() => {
      // animação de saída
      opacity.value = withTiming(0, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });
      translateY.value = withTiming(-30, {
        duration: 300,
        easing: Easing.in(Easing.ease),
      });

      // remove toast **após o tempo de animação**, usando JS thread
      setTimeout(() => hide(), 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.toast, styles[toast.type], animStyle]}>
      <Text style={styles.text}>{toast.message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    minWidth: "80%",
    alignSelf: "center",
    position: "absolute",
    top: 50,
    zIndex: 9999,
  },
  text: {
    color: Colors.white,
    textAlign: "center",
    fontWeight: "600",
  },
  success: { backgroundColor: Colors.green },
  error: { backgroundColor: Colors.error },
  info: { backgroundColor: Colors.blue },
});
