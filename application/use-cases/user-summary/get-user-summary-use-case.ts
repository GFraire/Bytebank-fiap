import { UserSummaryDTO } from "@/application/dtos/user-summary-dto";
import { UserSummaryMapper } from "@/application/mappers/user-summary-mapper";
import { UserSummaryRepository } from "@/domain/repositories/user-summary-repository";

export class GetUserSummaryUseCase {
  constructor(private userSummaryRepository: UserSummaryRepository) {}

  async execute(uid: string): Promise<UserSummaryDTO | null> {
    const summary = await this.userSummaryRepository.getByUser(uid);

    if (!summary) {
      return null;
    }

    return UserSummaryMapper.toDTO(summary);
  }
}
