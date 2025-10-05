import { ToastContainer } from "@/components/toast/toast-container";
import { Stack } from "expo-router";

export default function RootLayout() {
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
