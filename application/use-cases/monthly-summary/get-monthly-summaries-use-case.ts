import { MonthlySummaryDTO } from "@/application/dtos/monthly-summary-dto";
import { MonthlySummaryMapper } from "@/application/mappers/monthly-summary-mapper";
import { MonthlySummaryRepository } from "@/domain/repositories/monthly-summary-repository";

export class GetMonthlySummariesUseCase {
  constructor(private monthlySummaryRepository: MonthlySummaryRepository) {}

  async execute(userUid: string): Promise<MonthlySummaryDTO[]> {
    if (!userUid) {
      throw new Error("User UID é obrigatório");
    }

    const summaries = await this.monthlySummaryRepository.getByUser(userUid);

    return summaries.map((summary) => MonthlySummaryMapper.toDTO(summary));
  }
}
