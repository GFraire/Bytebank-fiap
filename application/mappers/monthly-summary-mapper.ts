import { MonthlySummary } from "@/domain/entities/monthly-summary";
import { MonthlySummaryDTO } from "../dtos/monthly-summary-dto";

export class MonthlySummaryMapper {
  static toDTO(summary: MonthlySummary): MonthlySummaryDTO {
    return {
      userUid: summary.userUid,
      month: summary.month,
      totalIncome: summary.totalIncome,
      totalExpense: summary.totalExpense,
    };
  }
}
