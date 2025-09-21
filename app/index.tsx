import {
  IconDevices,
  IconMoney,
  IconPresent,
  IconStar,
} from "@/components/icons";
import { Footer } from "@/components/login/footer";
import { HeroItem } from "@/components/login/hero-item";
import { Colors } from "@/constants/theme";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { LinearGradient } from "expo-linear-gradient";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
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
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Abrir conta</Text>
            </Pressable>

            <Pressable
              style={[styles.button, { marginLeft: 24 }, styles.buttonOutlined]}
            >
              <Text style={styles.buttonText}>Já tenho conta</Text>
            </Pressable>
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

          <View>
            <FlatList
              data={HERO_DATA}
              keyExtractor={(item) => item.title}
              renderItem={({ item }) => (
                <HeroItem
                  description={item.description}
                  icon={item.icon}
                  title={item.title}
                />
              )}
              ItemSeparatorComponent={() => <View style={{ height: 32 }} />}
            />
          </View>
        </LinearGradient>

        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
