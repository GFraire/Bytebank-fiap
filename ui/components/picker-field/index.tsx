import { Colors } from "@/ui/constants/theme";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface PickerFieldProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
  error?: string;
}

export default function PickerField({
  label,
  value,
  onValueChange,
  options,
  error,
}: PickerFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.pickerWrapper}>
        <Picker selectedValue={value} onValueChange={onValueChange}>
          {options.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>

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
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: Colors.white,
    height: 48, // mesma altura do TextInput
    justifyContent: "center",
  },
  error: {
    color: "#ef4444",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "Inter_400Regular",
  },
});
