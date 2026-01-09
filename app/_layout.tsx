import { ToastContainer } from "@/components/toast/toast-container";
import { useAuthListener } from "@/hooks/useAuthListener";
import { Stack } from "expo-router";

export default function RootLayout() {
  useAuthListener();

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
