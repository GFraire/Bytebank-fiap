// infra/repositories/FirebaseMonthlySummaryRepository.ts
import { MonthlySummary } from "@/domain/entities/monthly-summary";
import { Transaction } from "@/domain/entities/transaction";
import { MonthlySummaryRepository } from "@/domain/repositories/monthly-summary-repository";
import { db } from "@/infra/firebase/config/firebase-config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  where,
} from "firebase/firestore";

export class FirebaseMonthlySummaryRepository
  implements MonthlySummaryRepository
{
  private buildMonthKey(date: string) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  }

  async getByUser(userUid: string): Promise<MonthlySummary[]> {
    const q = query(
      collection(db, "monthly-summary"),
      where("userUid", "==", userUid),
      orderBy("month", "asc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      return new MonthlySummary({
        userUid: data.userUid,
        month: data.month,
        totalIncome: data.totalIncome,
        totalExpense: data.totalExpense,
      });
    });
  }

  async applyTransaction(transaction: Transaction): Promise<void> {
    const month = this.buildMonthKey(transaction.date);
    const ref = doc(db, "monthly-summary", `${transaction.userUid}_${month}`);

    const snap = await getDoc(ref);

    const summary = snap.exists()
      ? new MonthlySummary({
          userUid: snap.data().userUid,
          month: snap.data().month,
          totalIncome: snap.data().totalIncome,
          totalExpense: snap.data().totalExpense,
        })
      : new MonthlySummary({
          userUid: transaction.userUid,
          month,
        });

    summary.applyTransaction(transaction);

    await setDoc(ref, summary.toJSON(), { merge: true });
  }

  async removeTransaction(transaction: Transaction): Promise<void> {
    const month = this.buildMonthKey(transaction.date);
    const ref = doc(db, "monthly-summary", `${transaction.userUid}_${month}`);

    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const data = snap.data();

    const summary = new MonthlySummary({
      userUid: data.userUid,
      month: data.month,
      totalIncome: data.totalIncome,
      totalExpense: data.totalExpense,
    });

    summary.removeTransaction(transaction);

    await setDoc(ref, summary.toJSON(), { merge: true });
  }
}
