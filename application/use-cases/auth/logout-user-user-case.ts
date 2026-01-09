import { AuthRepository } from "@/domain/repositories/auth-repository";

export class LogoutUserUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(): Promise<void> {
    await this.authRepository.logout();
  }
}
