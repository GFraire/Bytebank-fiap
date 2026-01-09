import {
  TRANSACTION_CATEGORIES,
  TRANSACTION_TYPES,
} from "@/ui/constants/transactions";

export type TransactionFlow = "income" | "expense";

export type TransactionType =
  (typeof TRANSACTION_TYPES)[number]["value"];

export type TransactionCategory =
  (typeof TRANSACTION_CATEGORIES)[number]["value"];

export class Transaction {
  uid: string;
  userUid: string;
  description: string;
  amount: number;
  flow: TransactionFlow;
  type: TransactionType;
  category: TransactionCategory;
  createdAt: string;
  date: string;

  constructor(params: {
    uid: string;
    userUid: string;
    description: string;
    amount: number;
    flow: TransactionFlow;
    type: TransactionType;
    category: TransactionCategory;
    createdAt?: string;
    date: string;
  }) {
    this.uid = params.uid;
    this.userUid = params.userUid;
    this.description = params.description;
    this.amount = params.amount;
    this.flow = params.flow;
    this.type = params.type;
    this.category = params.category;
    this.createdAt = params.createdAt ?? new Date().toISOString();
    this.date = params.date;
  }
}
