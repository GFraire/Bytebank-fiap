import { Colors } from "@/constants/theme";
import { ReactElement } from "react";
import { StyleSheet, Text, View } from "react-native";
interface HeroItemProps {
  icon: ReactElement;
  title: string;
  description: string;
}

export function HeroItem({ icon, title, description }: HeroItemProps) {
  return (
    <View style={styles.container}>
      {icon}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: Colors.green,
  },
  description: {
    textAlign: "center",
    color: Colors["gray-700"],
    fontSize: 16,
  },
});
