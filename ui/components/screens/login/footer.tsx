import { IconInstagram, IconWhatsApp, IconYoutube } from "@/ui/components/icons";
import { Colors } from "@/ui/constants/theme";
import { Image, StyleSheet, Text, View } from "react-native";

export function Footer() {
  return (
    <View style={styles.container}>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Serviços</Text>
        <Text style={styles.sectionText}>Conta corrente</Text>
        <Text style={styles.sectionText}>Conta PJ</Text>
        <Text style={styles.sectionText}>Cartão de crédito</Text>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Contato</Text>
        <Text style={styles.sectionText}>0800 004 250 08</Text>
        <Text style={styles.sectionText}>meajuda@bytebank.com.br</Text>
        <Text style={styles.sectionText}>ouvidoria@bytebank.com.br</Text>
      </View>

      <Text style={styles.sectionTitle}>Desenvolvido por Alura</Text>

      <Image source={require("@/assets/images/logo-white.png")} />

      <View style={styles.iconsContainer}>
        <IconInstagram height={30} width={30} color="white" />

        <IconWhatsApp height={30} width={30} color="white" />

        <IconYoutube height={30} width={30} color="white" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.black,
    padding: 24,
    gap: 32,
  },
  sectionContainer: {
    gap: 8,
  },
  sectionTitle: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
  sectionText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
  iconsContainer: {
    flexDirection: "row",
    gap: 24,
  },
});
