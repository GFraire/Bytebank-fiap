import { UserSummaryRepository } from "../../repositories/user-summary-repository";

export class CreateUserSummaryUseCase {
  constructor(private userSummaryRepository: UserSummaryRepository) {}

  async execute(uid: string): Promise<void> {
    if (!uid) {
      throw new Error("User UID é obrigatório");
    }

    await this.userSummaryRepository.create(uid);
  }
}
