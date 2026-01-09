import { InputField } from "@/components/screens/login/input-field";
import { ToastItem } from "@/components/toast";
import { Colors } from "@/constants/theme";
import { useAuthStore } from "@/stores/auth-user-store";
import { useSummariesStore } from "@/stores/monthly-summaries-store";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
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
  const [toast, setToast] = useState<{
    id: number;
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const { loading, login } = useAuthStore();
  const {
    loading: summariesLoading,
    fetch: fetchSummaries,
    summaries,
  } = useSummariesStore();

  const isFormValid = email && password;

  function handleEmailChange(text: string) {
    setEmail(text);
  }

  function handlePasswordChange(text: string) {
    setPassword(text);
  }

  async function handleSignIn() {
    Keyboard.dismiss();

    const { error } = await login(email, password);
    const { error: fetchSummariesError } = await fetchSummaries();

    if (error) {
      setToast({
        id: Date.now(),
        message: "Erro ao logar: " + error,
        type: "error",
      });

      return;
    }

    if (fetchSummariesError) {
      setToast({
        id: Date.now(),
        message: "Erro ao buscar resumo mensal: " + fetchSummariesError,
        type: "error",
      });

      return;
    }

    setVisible(false);

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
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
          style={{ width: "100%" }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.modalContent}>
            {toast && <ToastItem toast={toast} onHide={() => setToast(null)} />}

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
                style={[
                  styles.button,
                  (!isFormValid || loading || summariesLoading) &&
                    styles.buttonDisabled,
                ]}
                disabled={!isFormValid || loading || summariesLoading}
                onPress={handleSignIn}
              >
                <Text style={styles.buttonText}>Acessar conta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    width: "90%",
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
