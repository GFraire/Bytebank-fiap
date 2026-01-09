import { MonthlySummary } from "../entities/monthly-summary";
import { Transaction } from "../entities/transaction";

export interface MonthlySummaryRepository {
  getByUser(userUid: string): Promise<MonthlySummary[]>;
  applyTransaction(transaction: Transaction): Promise<void>;
  removeTransaction(transaction: Transaction): Promise<void>;
}
