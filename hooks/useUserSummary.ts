import { db } from "@/firebaseConfig";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

export interface IUserSummary {
  balance: number;
  totalExpense: number;
  totalIncome: number;
  uid: string;
}

interface IUserSummaryResult {
  userSummary: IUserSummary | null;
  error: string | null;
}

export function useUserSummary() {
  async function addUserSummary(
    uid: string
  ): Promise<{ error: string | null }> {
    try {
      await addDoc(collection(db, "user-summary"), {
        balance: 0,
        totalExpense: 0,
        totalIncome: 0,
        uid,
      } as IUserSummary);

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  async function getUserSummary(uid: string): Promise<IUserSummaryResult> {
    try {
      const q = query(collection(db, "user-summary"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        return {
          userSummary: null,
          error: "Nenhum resumo encontrado para este usuário.",
        };
      }

      // Como só espera 1 registro, pega o primeiro
      const doc = querySnapshot.docs[0];
      const data = doc.data() as IUserSummary;

      return { userSummary: data, error: null };
    } catch (error: any) {
      return { userSummary: null, error: error.message };
    }
  }

  return { addUserSummary, getUserSummary };
}
