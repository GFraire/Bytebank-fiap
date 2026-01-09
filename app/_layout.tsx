import { ToastContainer } from "@/ui/components/toast/toast-container";
import { useAuthListener } from "@/ui/hooks/useAuthListener";
import { useAuthStore } from "@/ui/stores/auth-user-store";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function RootLayout() {
  useAuthListener();

  const { user, initializing } = useAuthStore();

  useEffect(() => {
    if (initializing) return;

    if (user) {
      router.replace("/(tabs)/dashboard");
    } else {
      router.replace("/login");
    }
  }, [initializing]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>

      <ToastContainer />
    </>
  );
}
