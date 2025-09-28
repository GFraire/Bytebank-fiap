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

interface AuthResult {
  user: {
    uid: string;
    email: string;
    displayName: string;
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

  async function login(email: string, password: string): Promise<AuthResult> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = {
        uid: userCredential.user.uid,
        email: userCredential.user.email as string,
        displayName: userCredential.user.displayName as string,
      };

      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }

  async function register(
    email: string,
    password: string,
    name: string
  ): Promise<AuthResult> {
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
        email: userCredential.user.email as string,
        displayName: userCredential.user.displayName as string,
      };

      return { user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }

  async function logout() {
    await signOut(auth);

    router.replace("/");
  }

  return { loading, login, register, logout };
}
