import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/useAuthStore";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  const { user } = useAuthStore();
  const { logout } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Pressable onPress={logout}>
        <Text>{user?.email}</Text>
      </Pressable>
    </View>
  );
}
