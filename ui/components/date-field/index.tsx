import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface DateFieldProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
  maximumDate?: Date; // nova prop
}

export default function DateField({
  label,
  value,
  onChange,
  error,
  maximumDate,
}: DateFieldProps) {
  const [show, setShow] = useState(false);

  function handleChange(event: any, selectedDate?: Date) {
    setShow(Platform.OS === "ios");

    if (selectedDate) {
      onChange(selectedDate); // mantém Date no estado
    }
  }

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <TouchableOpacity onPress={() => setShow(true)}>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          value={value ? value.toLocaleDateString() : ""}
          placeholder="Selecionar data"
          editable={false} // impede digitar
          pointerEvents="none" // apenas clicável pelo TouchableOpacity
        />
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={maximumDate} // aplica limite
        />
      )}

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
    fontWeight: "600",
    color: "#374151",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#fff",
    color: "#000",
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
