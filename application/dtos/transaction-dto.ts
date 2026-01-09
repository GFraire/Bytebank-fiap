import {
  TransactionCategory,
  TransactionFlow,
  TransactionType,
} from "@/domain/entities/transaction";

export type TransactionDTO = {
  uid: string;
  userUid: string;
  description: string;
  amount: number;
  flow: TransactionFlow;
  type: TransactionType;
  category: TransactionCategory;
  createdAt: string;
  date: string;
};
