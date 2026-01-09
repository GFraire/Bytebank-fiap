import { Transaction } from "./transaction";

export class MonthlySummary {
  userUid: string;
  month: string; // "YYYY-MM"
  totalIncome: number;
  totalExpense: number;

  constructor(params: {
    userUid: string;
    month: string;
    totalIncome?: number;
    totalExpense?: number;
  }) {
    this.userUid = params.userUid;
    this.month = params.month;
    this.totalIncome = params.totalIncome ?? 0;
    this.totalExpense = params.totalExpense ?? 0;
  }

  applyTransaction(transaction: Transaction) {
    if (transaction.flow === "income") {
      this.totalIncome += transaction.amount;
    } else {
      this.totalExpense += transaction.amount;
    }
  }

  removeTransaction(transaction: Transaction) {
    if (transaction.flow === "income") {
      this.totalIncome -= transaction.amount;
    } else {
      this.totalExpense -= transaction.amount;
    }
  }

  toJSON() {
    return {
      userUid: this.userUid,
      month: this.month,
      totalIncome: this.totalIncome,
      totalExpense: this.totalExpense,
    };
  }
}
