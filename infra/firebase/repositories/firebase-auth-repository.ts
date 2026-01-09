import { User } from "@/domain/entities/user";
import { AuthRepository } from "@/domain/repositories/auth-repository";
import { auth } from "@/infra/firebase/config/firebase-config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

export class FirebaseAuthRepository implements AuthRepository {
  async login(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(auth, email, password);

    return new User({
      uid: credential.user.uid,
      email: credential.user.email!,
      displayName: credential.user.displayName || "",
      balance: 0,
      totalExpense: 0,
      totalIncome: 0,
    });
  }

  async signUp(email: string, password: string, name: string): Promise<User> {
    const credential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(credential.user, { displayName: name });

    return {
      uid: credential.user.uid,
      email,
      displayName: name,
      balance: 0,
      totalExpense: 0,
      totalIncome: 0,
    };
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  async getCurrentUser(): Promise<User | null> {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return null;

    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email || "",
      displayName: firebaseUser.displayName || "",
      balance: 0,
      totalExpense: 0,
      totalIncome: 0,
    };
  }
}
