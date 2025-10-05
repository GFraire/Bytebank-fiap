import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  IconDevices,
  IconMoney,
  IconPresent,
  IconStar,
} from "@/components/icons";
import { Footer } from "@/components/screens/login/footer";
import { HeroItem } from "@/components/screens/login/hero-item";
import { ModalCreateUser } from "@/components/screens/login/modal-create-user";
import { ModalLoginUser } from "@/components/screens/login/modal-login-user";
import { Colors } from "@/constants/theme";
import { useUserStore } from "@/stores/userStore";

export default function Login() {
  const [isCreateUserModalVisible, setIsCreateUserModalVisible] =
    useState(false);
  const [isLoginUserModalVisible, setIsLoginUserModalVisible] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const { user, loading } = useUserStore();

  const HERO_DATA = [
    {
      icon: <IconPresent height={56} width={56} />,
      title: "Conta e cartão gratuitos",
      description:
        "Isso mesmo, nossa conta é digital, sem custo fixo e mais que isso: sem tarifa de manutenção.",
    },
    {
      icon: <IconMoney height={56} width={56} />,
      title: "Saques sem custo",
      description:
        "Você pode sacar gratuitamente 4x por mês de qualquer Banco 24h.",
    },
    {
      icon: <IconStar height={56} width={56} />,
      title: "Programa de pontos",
      description:
        "Você pode acumular pontos com suas compras no crédito sem pagar mensalidade!",
    },
    {
      icon: <IconDevices height={56} width={56} />,
      title: "Seguro dispositivos",
      description:
        "Seus dispositivos móveis (computador e laptop) protegidos por uma mensalidade simbólica.",
    },
  ];

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!isFirstRender.current) return;

    if (!loading && user) {
      setIsCreateUserModalVisible(false);
      setIsLoginUserModalVisible(false);
      router.replace("/(tabs)/dashboard");
    }

    isFirstRender.current = false;
  }, []); // array de dependências vazio -> só roda no mount

  function onSetCreateUserVisible(value: boolean) {
    setIsCreateUserModalVisible(value);
  }

  function onSetLoginUserVisible(value: boolean) {
    setIsLoginUserModalVisible(value);
  }

  if (!fontsLoaded) {
    return null;
  }

  if (loading && isFirstRender.current) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView>
        <View style={styles.header}>
          <Image
            style={styles.headerImage}
            source={require("@/assets/images/logo.png")}
          />
        </View>

        <LinearGradient
          colors={["#004D61", "#FFF"]}
          style={styles.linearGradient}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setIsCreateUserModalVisible(true)}
            >
              <Text style={styles.buttonText}>Abrir conta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { marginLeft: 24 }, styles.buttonOutlined]}
              onPress={() => setIsLoginUserModalVisible(true)}
            >
              <Text style={styles.buttonText}>Já tenho conta</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bannerContainer}>
            <Text style={styles.bannerText}>
              Experimente mais liberdade no controle da sua vida financeira.
              Crie sua conta com a gente!
            </Text>

            <Image
              style={styles.bannerImage}
              source={require("@/assets/images/banner.png")}
            />
          </View>

          <View style={{ gap: 24 }}>
            {HERO_DATA.map((item) => (
              <HeroItem
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.description}
              />
            ))}
          </View>
        </LinearGradient>

        <Footer />
      </ScrollView>

      <ModalCreateUser
        isVisible={isCreateUserModalVisible}
        setVisible={onSetCreateUserVisible}
      />

      <ModalLoginUser
        isVisible={isLoginUserModalVisible}
        setVisible={onSetLoginUserVisible}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  header: {
    backgroundColor: Colors.black,
    paddingVertical: 24,
    paddingRight: 24,
  },
  headerImage: {
    marginHorizontal: "auto",
  },
  linearGradient: {
    flex: 1,
    padding: 24,
    gap: 32,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  button: {
    flex: 1,
    backgroundColor: Colors.green,
    paddingVertical: 16,
    borderRadius: 8,
  },
  buttonOutlined: {
    backgroundColor: "transparent",
    borderColor: Colors.green,
    borderWidth: 2,
    paddingVertical: 14,
  },
  buttonText: {
    textAlign: "center",
    fontFamily: "Inter_600SemiBold",
    color: Colors.white,
    fontSize: 16,
  },
  bannerContainer: {
    gap: 16,
  },
  bannerText: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: Colors.black,
    textAlign: "justify",
  },
  bannerImage: {
    width: "100%",
    resizeMode: "contain",
  },
});
