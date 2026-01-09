import { UserSummary } from "../../entities/user-summary";
import { UserSummaryRepository } from "../../repositories/user-summary-repository";

interface UpdateUserSummaryInput {
  uid: string;
  updates: Partial<UserSummary>;
}

export class UpdateUserSummaryUseCase {
  constructor(private userSummaryRepository: UserSummaryRepository) {}

  async execute({
    uid,
    updates,
  }: UpdateUserSummaryInput): Promise<UserSummary> {
    if (!uid) {
      throw new Error("UID do usuário é obrigatório");
    }

    if (Object.keys(updates).length === 0) {
      throw new Error("Nenhuma atualização informada");
    }

    return this.userSummaryRepository.update(uid, updates);
  }
}
