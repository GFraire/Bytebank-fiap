import { UserSummary } from "@/domain/entities/user-summary";
import { UserSummaryDTO } from "../dtos/user-summary-dto";

export class UserSummaryMapper {
  static toDTO(summary: UserSummary): UserSummaryDTO {
    return {
      uid: summary.uid,
      balance: summary.balance,
      totalIncome: summary.totalIncome,
      totalExpense: summary.totalExpense,
    };
  }
}
