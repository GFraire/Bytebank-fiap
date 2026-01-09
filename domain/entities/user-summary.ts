import { Transaction } from "./transaction";

export class UserSummary {
  uid: string;
  balance: number;
  totalIncome: number;
  totalExpense: number;

  constructor(params: {
    uid: string;
    balance?: number;
    totalIncome?: number;
    totalExpense?: number;
  }) {
    this.uid = params.uid;
    this.totalIncome = params.totalIncome ?? 0;
    this.totalExpense = params.totalExpense ?? 0;
    this.balance = params.balance ?? this.totalIncome - this.totalExpense;
  }

  applyTransaction(transaction: Transaction) {
    if (transaction.flow === "income") {
      this.totalIncome += transaction.amount;
    } else {
      this.totalExpense += transaction.amount;
    }

    this.recalculateBalance();
  }

  removeTransaction(transaction: Transaction) {
    if (transaction.flow === "income") {
      this.totalIncome -= transaction.amount;
    } else {
      this.totalExpense -= transaction.amount;
    }

    this.recalculateBalance();
  }

  private recalculateBalance() {
    this.balance = this.totalIncome - this.totalExpense;
  }
}
