import { Colors } from "@/constants/theme";
import { useUserStore } from "@/stores/useUserStore";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

type IoniconsName = keyof typeof Ionicons.glyphMap;

interface IHeaderProps {
  title: string;
  description: string;
  icon: IoniconsName;
}

export function Header({ icon, title, description }: IHeaderProps) {
  const { user, logout } = useUserStore();

  const userName = user?.displayName.split(" ")[0];

  return (
    <View style={styles.container}>
      <View style={styles.infoScreen}>
        <Ionicons name={icon} size={24} color={Colors["gray-500"]} />

        <View>
          <Text style={styles.infoScreenTitle}>{title}</Text>
          <Text style={styles.infoScreenDescription}>{description}</Text>
        </View>
      </View>

      <View>
        <Text style={styles.userInfo}>Olá, {userName}</Text>
        <Pressable onPress={logout}>
          <Text style={styles.logoutText}>Sair</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors["gray-100"],
    width: "100%",
    borderBottomColor: Colors["gray-200"],
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoScreen: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoScreenTitle: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  infoScreenDescription: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: Colors["gray-500"],
  },
  userInfo: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
  },
  logoutText: {
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    textDecorationLine: "underline",
    color: Colors["gray-500"],
  },
});
