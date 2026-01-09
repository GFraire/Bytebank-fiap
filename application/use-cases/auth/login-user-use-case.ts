import { UserDTO } from "@/application/dtos/user-dto";
import { UserMapper } from "@/application/mappers/user-mapper";
import { AuthRepository } from "@/domain/repositories/auth-repository";
import { UserSummaryRepository } from "@/domain/repositories/user-summary-repository";

interface LoginUserInput {
  email: string;
  password: string;
}

export class LoginUserUseCase {
  constructor(
    private authRepository: AuthRepository,
    private userSummaryRepository: UserSummaryRepository
  ) {}

  async execute(input: LoginUserInput): Promise<UserDTO> {
    const { email, password } = input;

    if (!email || !password) {
      throw new Error("Email e senha são obrigatórios");
    }

    const user = await this.authRepository.login(email, password);

    const userSummary = await this.userSummaryRepository.getByUser(user.uid);

    if (!userSummary) {
      throw new Error("Resumo do usuário não encontrado");
    }

    return UserMapper.toDTO({
      ...user,
      balance: userSummary.balance,
      totalIncome: userSummary.totalIncome,
      totalExpense: userSummary.totalExpense,
    });
  }
}
