import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function Index() {
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    async function checkToken() {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        console.log(token);
        
        router.replace("/");
      } else {
        setLoading(false);
      }
    }

    checkToken();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Index</Text>
    </View>
  );
}
