export class User {
  uid: string;
  email: string;
  displayName: string;
  totalExpense: number;
  totalIncome: number;
  balance: number;

  constructor(params: {
    uid: string;
    email: string;
    displayName: string;
    totalExpense?: number;
    totalIncome?: number;
    balance?: number;
  }) {
    this.uid = params.uid;
    this.email = params.email;
    this.displayName = params.displayName;
    this.totalExpense = params.totalExpense ?? 0;
    this.totalIncome = params.totalIncome ?? 0;
    this.balance = params.balance ?? this.totalIncome - this.totalExpense;
  }
}
