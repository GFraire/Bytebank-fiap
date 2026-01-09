import { Colors } from "@/ui/constants/theme";
import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface TextFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  keyboardType?: "default" | "numeric" | "email-address";
}

export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType = "default",
}: TextFieldProps) {
  const handleChange = (text: string) => {
    if (keyboardType === "numeric") {
      // Remove tudo que não seja número ou vírgula
      const numericText = text.replace(/[^\d,]/g, "");

      // Formata milhar com ponto
      const parts = numericText.split(",");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      const formatted = parts.join(",");

      onChangeText(formatted);
    } else {
      onChangeText(text);
    }
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flex: 1,
    minWidth: "48%",
    marginRight: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: Colors["gray-700"],
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#fff",
    fontFamily: "Inter_400Regular",
  },
  inputError: {
    borderColor: "#ef4444",
  },
  error: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Inter_400Regular",
  },
});
