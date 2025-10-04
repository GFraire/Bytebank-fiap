import { db } from "@/firebaseConfig";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

export interface ITransaction {
  amount: number;
  type: "income" | "expense";
  createdAt: Date;
  uid: string;
}

export function useTransaction() {
  async function addTransaction(transaction: ITransaction) {
    try {
      const docRef = await addDoc(collection(db, "transactions"), transaction);

      console.log("Transação salva com ID:", docRef.id);
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
    }
  }

async function getTransactionsByUser(uid: string): Promise<ITransaction[]> {
    try {
      const q = query(collection(db, "transactions"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data() as ITransaction);
    } catch (error) {
      console.error("Erro ao buscar transações:", error);
      return [];
    }
  }

  return { addTransaction, getTransactionsByUser };
}
