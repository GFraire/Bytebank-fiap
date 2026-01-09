import { GetMonthlySummariesUseCase } from "@/application/use-cases/monthly-summary/get-monthly-summaries-use-case";
import { FirebaseMonthlySummaryRepository } from "@/infra/firebase/repositories/firebase-monthly-summary-repository";

const monthlySummaryRepository = new FirebaseMonthlySummaryRepository();

export const getMonthlySummariesUseCase = new GetMonthlySummariesUseCase(
  monthlySummaryRepository
);
