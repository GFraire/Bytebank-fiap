import { UserDTO } from "@/application/dtos/user-dto";
import { UserMapper } from "@/application/mappers/user-mapper";
import { AuthRepository } from "@/domain/repositories/auth-repository";
import { UserSummaryRepository } from "@/domain/repositories/user-summary-repository";

interface SignUpUserInput {
  email: string;
  password: string;
  name: string;
}

export class SignUpUserUseCase {
  constructor(
    private authRepository: AuthRepository,
    private userSummaryRepository: UserSummaryRepository
  ) {}

  async execute({ email, password, name }: SignUpUserInput): Promise<UserDTO> {
    if (!email || !password || !name) {
      throw new Error("Todos os campos são obrigatórios");
    }

    if (password.length < 6) {
      throw new Error("Senha deve ter no mínimo 6 caracteres");
    }

    const user = await this.authRepository.signUp(email, password, name);

    await this.userSummaryRepository.create(user.uid);

    return UserMapper.toDTO({
      ...user,
      balance: 0,
      totalIncome: 0,
      totalExpense: 0,
    });
  }
}
