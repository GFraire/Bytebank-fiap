import { Colors } from "@/constants/theme";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

type BaseButtonType = "primary" | "success" | "error" | "info";

interface BaseButtonProps {
  title: string;
  onPress: () => void;
  type?: BaseButtonType;
  disabled?: boolean;
  loading?: boolean;
}

export function BaseButton({
  title,
  onPress,
  type = "primary",
  disabled = false,
  loading = false,
}: BaseButtonProps) {
  const isDisabled = disabled || loading;

  const backgroundColor = isDisabled
    ? Colors["gray-300"]
    : type === "primary"
    ? Colors.secondary
    : type === "success"
    ? Colors.green
    : type === "error"
    ? Colors.error
    : Colors.blue; // info

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor }]}
      disabled={isDisabled}
      onPress={onPress}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
});
