import { Colors } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface InputFieldProps {
  placeholder: string;
  label: string;
  type?: "text" | "email" | "password"; // novo tipo
  onChangeText: (text: string) => void;
}

export function InputField({
  placeholder,
  label,
  type = "text",
  onChangeText,
}: InputFieldProps) {
  const [value, setValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(text: string) {
    setValue(text);
    onChangeText(text);
  }

  const isPassword = type === "password";

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          autoCapitalize={type === "email" ? "none" : "sentences"}
          autoCorrect={type === "email" ? false : true}
          autoComplete={type === "email" ? "email" : "off"}
          keyboardType={type === "email" ? "email-address" : "default"}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={isPassword && !showPassword}
          value={value}
          onChangeText={handleChange}
        />

        {isPassword && (
          <TouchableOpacity
            style={styles.icon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={24}
              color="#999"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    marginBottom: 6,
  },
  inputContainer: {
    position: "relative",
  },
  input: {
    height: 48,
    width: "100%",
    borderWidth: 1,
    borderColor: "#DEE9EA",
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingLeft: 16,
    paddingRight: 40, // espaço pro ícone
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  icon: {
    position: "absolute",
    right: 12,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
});
