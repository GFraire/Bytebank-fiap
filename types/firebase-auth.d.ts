// firebase-auth.d.ts
import AsyncStorageType from "@react-native-async-storage/async-storage";

declare module "firebase/auth" {
  // declara a função que existe apenas para RN
  export function getReactNativePersistence(
    storage: typeof AsyncStorageType
  ): any;
}
