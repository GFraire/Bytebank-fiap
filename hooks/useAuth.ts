import { auth } from "@/firebaseConfig";
import { useAuthStore } from "@/stores/useAuthStore";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { useEffect, useState } from "react";

interface RegisterResult {
  user: {
    uid: string;
    email: string | null;
    displayName: string | null;
  } | null;
  error: string | null;
}

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const { setUser } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
      } else {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || "",
          displayName: firebaseUser.displayName || "",
        });
      }

      setLoading(false);
    });

    return unsubscribe; // limpa o listener quando desmonta
  }, []);

  async function login(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  async function register(
    email: string,
    password: string,
    name: string
  ): Promise<RegisterResult> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name,
      });

      const user = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: userCredential.user.displayName,
      };

      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }

  async function logout() {
    await signOut(auth)
    
    router.replace("/");
  }

  return { loading, login, register, logout };
}
