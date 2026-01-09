import { Transaction } from "../entities/transaction";

export interface TransactionRepository {
  add(transaction: Omit<Transaction, "uid">): Promise<Transaction>;
  update(transaction: Transaction): Promise<Transaction>;
  delete(transaction: Transaction): Promise<void>;
  getByUser(uid: string, limit: number, lastDoc?: any): Promise<{
    transactions: Transaction[];
    lastDoc?: any;
  }>;
  getById(transactionUid: string): Promise<Transaction | null>;
}
