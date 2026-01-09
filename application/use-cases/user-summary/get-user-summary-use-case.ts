import { UserSummaryDTO } from "@/application/dtos/user-summary-dto";
import { UserSummaryMapper } from "@/application/mappers/user-summary-mapper";
import { UserSummaryRepository } from "@/domain/repositories/user-summary-repository";

export class GetUserSummaryUseCase {
  constructor(private userSummaryRepository: UserSummaryRepository) {}

  async execute(uid: string): Promise<UserSummaryDTO> {
    const summary = await this.userSummaryRepository.getByUser(uid);

    if (!summary) {
      throw new Error("Nenhum resumo encontrado para este usuário");
    }

    return UserSummaryMapper.toDTO(summary);
  }
}
