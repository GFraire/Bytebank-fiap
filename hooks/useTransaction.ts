import { db } from "@/firebaseConfig";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";

export interface ITransaction {
  uid: string;
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
    transaction: ITransaction
  ): Promise<{ error: string | null }> {
    try {
      await addDoc(collection(db, "transactions"), transaction);

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  async function getTransactionsByUser(
    uid: string
  ): Promise<{ transactions: ITransaction[] | null; error: string | null }> {
    try {
      const q = query(collection(db, "transactions"), where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const transactions = querySnapshot.docs.map(
        (doc) => doc.data() as ITransaction
      );

      return { transactions, error: null };
    } catch (error: any) {
      return { transactions: null, error: error.message };
    }
  }

  return { addTransaction, getTransactionsByUser };
}
