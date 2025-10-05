import { useToastStore } from "@/stores/toastStore";
import React from "react";
import { StyleSheet, View } from "react-native";
import { ToastItem } from "./index";

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    width: "100%",
    alignItems: "center",
    zIndex: 9999,
    pointerEvents: "box-none",
  },
});
