import { UserSummary } from "@/domain/entities/user-summary";
import { UserSummaryRepository } from "@/domain/repositories/user-summary-repository";
import { db } from "@/infra/firebase/config/firebase-config";
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

export class FirebaseUserSummaryRepository implements UserSummaryRepository {
  private collectionRef = collection(db, "user-summary");

  async create(uid: string): Promise<void> {
    await addDoc(this.collectionRef, {
      uid,
      balance: 0,
      totalIncome: 0,
      totalExpense: 0,
    });
  }

  async getByUser(uid: string) {
    const q = query(this.collectionRef, where("uid", "==", uid));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const data = snapshot.docs[0].data();

    return new UserSummary({
      uid: data.uid,
      balance: data.balance,
      totalIncome: data.totalIncome,
      totalExpense: data.totalExpense,
    });
  }

  async update(
    uid: string,
    updates: Partial<UserSummary>
  ): Promise<UserSummary> {
    const q = query(this.collectionRef, where("uid", "==", uid));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error("Resumo do usuário não encontrado");
    }

    const docRef = snapshot.docs[0].ref;
    const current = snapshot.docs[0].data();

    await updateDoc(docRef, updates);

    return new UserSummary({
      uid,
      balance: updates.balance ?? current.balance,
      totalIncome: updates.totalIncome ?? current.totalIncome,
      totalExpense: updates.totalExpense ?? current.totalExpense,
    });
  }
}
