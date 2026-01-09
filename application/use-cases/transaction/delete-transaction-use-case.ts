import { TransactionDTO } from "@/application/dtos/transaction-dto";
import { UserSummaryDTO } from "@/application/dtos/user-summary-dto";
import { TransactionMapper } from "@/application/mappers/transaction-mapper";
import { UserSummaryMapper } from "@/application/mappers/user-summary-mapper";
import { Transaction } from "@/domain/entities/transaction";
import { MonthlySummaryRepository } from "@/domain/repositories/monthly-summary-repository";
import { TransactionRepository } from "@/domain/repositories/transaction-repository";
import { UserSummaryRepository } from "@/domain/repositories/user-summary-repository";

export class DeleteTransactionUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private monthlySummaryRepository: MonthlySummaryRepository,
    private userSummaryRepository: UserSummaryRepository
  ) {}

  async execute(
    transaction: Transaction
  ): Promise<{ transaction: TransactionDTO; userSummary: UserSummaryDTO }> {
    // Remove transação do repositório
    await this.transactionRepository.delete(transaction);

    // Remove impacto no resumo mensal
    await this.monthlySummaryRepository.removeTransaction(transaction);

    // Atualiza o resumo do usuário
    const userSummary = await this.userSummaryRepository.getByUser(
      transaction.userUid
    );

    if (!userSummary) {
      throw new Error("Resumo do usuário não encontrado");
    }

    userSummary.removeTransaction(transaction);

    const { uid, ...updateData } = userSummary;
    await this.userSummaryRepository.update(uid, updateData);

    return {
      transaction: TransactionMapper.toDTO(transaction),
      userSummary: UserSummaryMapper.toDTO(userSummary),
    };
  }
}
