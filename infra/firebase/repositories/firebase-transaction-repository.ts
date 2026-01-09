import { Transaction } from "@/domain/entities/transaction";
import { TransactionRepository } from "@/domain/repositories/transaction-repository";
import { db } from "@/infra/firebase/config/firebase-config";
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
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";

export class FirebaseTransactionRepository implements TransactionRepository {
  async add(transaction: Omit<Transaction, "uid">): Promise<Transaction> {
    const docRef = await addDoc(collection(db, "transactions"), transaction);
    await updateDoc(docRef, { uid: docRef.id });

    return { ...transaction, uid: docRef.id };
  }

  async update(transaction: Transaction): Promise<Transaction> {
    const { uid, ...data } = transaction;
    await updateDoc(doc(db, "transactions", uid), data);
    return transaction;
  }

  async delete(transaction: Transaction): Promise<void> {
    await deleteDoc(doc(db, "transactions", transaction.uid));
  }

  async getByUser(
    userUid: string,
    pageSize: number,
    startAfterDoc?: any
  ): Promise<{ transactions: Transaction[]; lastDoc?: any }> {
    let q = query(
      collection(db, "transactions"),
      where("userUid", "==", userUid),
      orderBy("date", "desc"),
      limit(pageSize)
    );

    if (startAfterDoc) q = query(q, startAfter(startAfterDoc));

    const snapshot = await getDocs(q);

    return {
      transactions: snapshot.docs.map((d) => {
        const data = d.data() as Transaction;

        return new Transaction(data);
      }),
      lastDoc: snapshot.docs.at(-1),
    };
  }

  async getById(transactionUid: string): Promise<Transaction | null> {
    const ref = doc(db, "transactions", transactionUid);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    const data = snap.data() as Omit<Transaction, "uid">;

    return new Transaction({
      uid: snap.id,
      ...data,
    });
  }
}
