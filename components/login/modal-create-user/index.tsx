import { InputField } from "@/components/input-field";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/useAuthStore";
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
  View
} from "react-native";

interface ModalCreateUserProps {
  isVisible: boolean;
  setVisible: (value: boolean) => void;
}

export function ModalCreateUser({
  isVisible,
  setVisible,
}: ModalCreateUserProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setUser } = useAuthStore();
  const { register } = useAuth();

  const isFormValid = name && email && password;

  function handleEmailChange(text: string) {
    setEmail(text);
  }

  function handleNameChange(text: string) {
    setName(text);
  }

  function handlePasswordChange(text: string) {
    setPassword(text);
  }

  async function handleSignUp() {
    const { user, error } = await register(email, password, name);

    if (error || !user) {
      console.log("Erro ao registrar:", error);
      // Exibir toast/alert
      return;
    }

    setUser({
      uid: user.uid,
      displayName: name,
      email,
    });

    router.push("/(tabs)/dashboard");
  }

  return (
    <Modal visible={isVisible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
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
            Preencha os campos abaixo para criar sua conta corrente!
          </Text>

          <View style={styles.form}>
            <InputField
              label="Nome"
              placeholder="Digite seu nome completo"
              onChangeText={handleNameChange}
            />

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
          </View>

          <TouchableOpacity
            style={[styles.button, !isFormValid && styles.buttonDisabled]}
            disabled={!isFormValid}
            onPress={handleSignUp}
          >
            <Text style={styles.buttonText}>Criar conta</Text>
          </TouchableOpacity>
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
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  buttonDisabled: {
    backgroundColor: Colors["gray-300"],
  },
});
