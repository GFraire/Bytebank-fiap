import { InputField } from "@/components/screens/login/input-field";
import { Colors } from "@/constants/theme";
import { useUserStore } from "@/stores/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ModalLoginUserProps {
  isVisible: boolean;
  setVisible: (value: boolean) => void;
}

export function ModalLoginUser({ isVisible, setVisible }: ModalLoginUserProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useUserStore();

  const isFormValid = email && password;

  function handleEmailChange(text: string) {
    setEmail(text);
  }

  function handlePasswordChange(text: string) {
    setPassword(text);
  }

  async function handleSignIn() {
    const { error } = await login(email, password);

    if (error) {
      console.log("Erro ao logar:", error);
      // Exibir toast/alert
      return;
    }

    router.push("/(tabs)/dashboard");
  }

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Pressable style={styles.close} onPress={() => setVisible(false)}>
            <Ionicons name="close" size={24} color="#999" />
          </Pressable>

          <Image
            style={styles.image}
            source={require("@/assets/images/laptop-woman.png")}
          />

          <Text style={styles.title}>
            Preencha os campos abaixo para logar na sua conta!
          </Text>

          <View style={styles.form}>
            <InputField
              label="E-mail"
              placeholder="Digite seu e-mail"
              type="email"
              onChangeText={handleEmailChange}
            />

            <InputField
              label="Senha"
              placeholder="Digite sua senha"
              type="password"
              onChangeText={handlePasswordChange}
            />

            <TouchableOpacity
              style={[styles.button, !isFormValid && styles.buttonDisabled]}
              disabled={!isFormValid}
              onPress={handleSignIn}
            >
              <Text style={styles.buttonText}>Acessar conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    padding: 32,
    backgroundColor: Colors["gray-100"],
    borderRadius: 8,
    alignItems: "center",
    gap: 24,
  },
  image: {
    height: 160,
    resizeMode: "contain",
  },
  title: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  form: {
    width: "100%",
  },
  close: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  button: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: "100%",
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
  },
  buttonDisabled: {
    backgroundColor: Colors["gray-300"],
  },
});
