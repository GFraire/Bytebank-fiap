import { db } from "@/firebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";

export interface ITransaction {
  uid: string;
  userUid: string;
  description: string;
  amount: number;
  flow: "income" | "expense";
  type: (typeof TRANSACTION_TYPES)[number]["value"];
  category: (typeof TRANSACTION_CATEGORIES)[number]["value"];
  createdAt: string; // ISO string
  date: string; // ISO string
}

export const TRANSACTION_TYPES: { label: string; value: string }[] = [
  { label: "Depósito", value: "deposit" },
  { label: "Transferência", value: "transfer" },
  { label: "Boleto / Conta", value: "boleto" },
  { label: "Pix", value: "pix" },
  { label: "Cartão de Crédito", value: "credit_card" },
  { label: "Cartão de Débito", value: "debit_card" },
  { label: "Saque", value: "withdraw" },
  { label: "Outros", value: "other" },
];

export const TRANSACTION_CATEGORIES: { label: string; value: string }[] = [
  { value: "Alimentação", label: "Alimentação" },
  { value: "Transporte", label: "Transporte" },
  { value: "Moradia", label: "Moradia" },
  { value: "Lazer", label: "Lazer" },
  { value: "Saúde", label: "Saúde" },
  { value: "Educação", label: "Educação" },
  { value: "Trabalho", label: "Trabalho" },
  { value: "Outros", label: "Outros" },
];

export function useTransaction() {
  async function addTransaction(
    transaction: Omit<ITransaction, "uid">
  ): Promise<{ transaction: ITransaction; error: string | null }> {
    try {
      const docRef = await addDoc(collection(db, "transactions"), transaction);

      await updateDoc(docRef, {
        uid: docRef.id,
      });

      return { transaction: { ...transaction, uid: docRef.id }, error: null };
    } catch (error: any) {
      return { transaction: { ...transaction, uid: "" }, error: error.message };
    }
  }

  async function getTransactionsByUser(
    userUid: string,
    pageSize = 10,
    startAfterDoc?: QueryDocumentSnapshot
  ): Promise<{
    transactions: ITransaction[];
    lastDoc?: QueryDocumentSnapshot;
    error: string | null;
  }> {
    try {
      let q = query(
        collection(db, "transactions"),
        where("userUid", "==", userUid),
        orderBy("date", "desc"),
        limit(pageSize)
      );

      if (startAfterDoc) {
        q = query(q, startAfter(startAfterDoc));
      }

      const querySnapshot = await getDocs(q);
      const transactions = querySnapshot.docs.map(
        (doc) => ({ uid: doc.id, ...doc.data() } as ITransaction)
      );
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

      return { transactions, lastDoc, error: null };
    } catch (error: any) {
      return { transactions: [], error: error.message };
    }
  }

  return { addTransaction, getTransactionsByUser };
}
