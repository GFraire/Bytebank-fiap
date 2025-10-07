import { db } from "@/firebaseConfig";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryDocumentSnapshot,
  setDoc,
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

export interface IMonthlySummary {
  userUid: string;
  month: string; // "YYYY-MM"
  totalIncome: number;
  totalExpense: number;
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
      const newTransaction = { ...transaction, uid: docRef.id };

      await updateDoc(docRef, { uid: docRef.id });
      await updateMonthlySummary(newTransaction);

      return { transaction: newTransaction, error: null };
    } catch (error: any) {
      return { transaction: { ...transaction, uid: "" }, error: error.message };
    }
  }

  async function getTransactionsByUser(
    userUid: string,
    pageSize = 6,
    startAfterDoc?: QueryDocumentSnapshot
  ) {
    try {
      let q = query(
        collection(db, "transactions"),
        where("userUid", "==", userUid),
        orderBy("date", "desc"),
        limit(pageSize)
      );

      if (startAfterDoc) q = query(q, startAfter(startAfterDoc));

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

  async function updateTransaction(transaction: ITransaction) {
    try {
      const transactionRef = doc(db, "transactions", transaction.uid);

      // Pega a transação antiga
      const oldSnap = await getDoc(transactionRef);
      const oldTransaction = oldSnap.data() as ITransaction | undefined;

      if (!oldTransaction) throw new Error("Transação não encontrada");

      // Cria um objeto sem o 'uid' para enviar ao updateDoc
      const { uid, ...transactionData } = transaction;

      // Atualiza a transação
      await updateDoc(transactionRef, transactionData);

      // Atualiza monthly-summary: remove valores antigos
      const oldDate = new Date(oldTransaction.date);
      const oldMonthKey = `${oldDate.getFullYear()}-${String(
        oldDate.getMonth() + 1
      ).padStart(2, "0")}`;
      const oldSummaryRef = doc(
        db,
        "monthly-summary",
        `${oldTransaction.userUid}_${oldMonthKey}`
      );
      const oldSummarySnap = await getDoc(oldSummaryRef);
      const oldSummaryData = oldSummarySnap.data() as
        | IMonthlySummary
        | undefined;

      if (oldSummaryData) {
        if (oldTransaction.flow === "income")
          oldSummaryData.totalIncome -= oldTransaction.amount;
        else oldSummaryData.totalExpense -= oldTransaction.amount;

        await setDoc(oldSummaryRef, oldSummaryData, { merge: true });
      }

      // Adiciona valores da nova transação no summary correto
      const newDate = new Date(transaction.date);
      const newMonthKey = `${newDate.getFullYear()}-${String(
        newDate.getMonth() + 1
      ).padStart(2, "0")}`;
      const newSummaryRef = doc(
        db,
        "monthly-summary",
        `${transaction.userUid}_${newMonthKey}`
      );
      const newSummarySnap = await getDoc(newSummaryRef);
      const newSummaryData = newSummarySnap.data() as
        | IMonthlySummary
        | {
            userUid: string;
            month: string;
            totalIncome: number;
            totalExpense: number;
          }
        | undefined;

      const summaryToUpdate = newSummaryData || {
        userUid: transaction.userUid,
        month: newMonthKey,
        totalIncome: 0,
        totalExpense: 0,
      };

      if (transaction.flow === "income")
        summaryToUpdate.totalIncome += transaction.amount;
      else summaryToUpdate.totalExpense += transaction.amount;

      await setDoc(newSummaryRef, summaryToUpdate, { merge: true });

      return { transaction, error: null };
    } catch (error: any) {
      return { transaction: null, error: error.message };
    }
  }

  async function updateMonthlySummary(transaction: ITransaction) {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`; // Ex: "2025-10"
    const summaryDocRef = doc(
      db,
      "monthly-summary",
      `${transaction.userUid}_${monthKey}`
    );

    const summarySnap = await getDoc(summaryDocRef);
    const data = summarySnap.data() || {
      userUid: transaction.userUid,
      month: monthKey,
      totalIncome: 0,
      totalExpense: 0,
    };

    if (transaction.flow === "income") data.totalIncome += transaction.amount;
    else data.totalExpense += transaction.amount;

    await setDoc(summaryDocRef, data, { merge: true });
  }

  async function updateMonthlySummaryOnDelete(transaction: ITransaction) {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
    const summaryDocRef = doc(
      db,
      "monthly-summary",
      `${transaction.userUid}_${monthKey}`
    );

    const summarySnap = await getDoc(summaryDocRef);

    if (!summarySnap.exists()) return; // não há resumo para atualizar

    const data = summarySnap.data() as IMonthlySummary;

    if (transaction.flow === "income")
      data.totalIncome = Math.max(0, data.totalIncome - transaction.amount);
    else
      data.totalExpense = Math.max(0, data.totalExpense - transaction.amount);

    await setDoc(summaryDocRef, data, { merge: true });
  }

  async function deleteTransaction(transaction: ITransaction) {
    try {
      const docRef = doc(db, "transactions", transaction.uid);

      await deleteDoc(docRef);

      await updateMonthlySummaryOnDelete(transaction);

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  async function getMonthlySummaries(userUid: string) {
    const q = query(
      collection(db, "monthly-summary"),
      where("userUid", "==", userUid),
      orderBy("month", "asc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data() as IMonthlySummary);
  }

  return {
    addTransaction,
    deleteTransaction,
    getTransactionsByUser,
    getMonthlySummaries,
    updateTransaction
  };
}
