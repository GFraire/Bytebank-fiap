import { Header } from "@/components/header";
import { List } from "@/components/screens/extract/list";
import { Colors } from "@/constants/theme";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Extract() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />

      <Header
        description="Histórico completo de suas transações"
        icon="document-text-outline"
        title="Transações"
      />

      <View style={styles.content}>
        <Text>FIltro...</Text>
        <Text>FIltro...</Text>
        <Text>FIltro...</Text>
        <List />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    padding: 16,
    gap: 16,
    flex: 1,
  },
});
