import { TransactionDTO } from "@/application/dtos/transaction-dto";
import { UserSummaryDTO } from "@/application/dtos/user-summary-dto";
import { TransactionMapper } from "@/application/mappers/transaction-mapper";
import { UserSummaryMapper } from "@/application/mappers/user-summary-mapper";
import { Transaction } from "@/domain/entities/transaction";
import { MonthlySummaryRepository } from "@/domain/repositories/monthly-summary-repository";
import { TransactionRepository } from "@/domain/repositories/transaction-repository";
import { UserSummaryRepository } from "@/domain/repositories/user-summary-repository";

export class UpdateTransactionUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private monthlySummaryRepository: MonthlySummaryRepository,
    private userSummaryRepository: UserSummaryRepository
  ) {}

  async execute(
    transaction: Transaction
  ): Promise<{ transaction: TransactionDTO; userSummary: UserSummaryDTO }> {
    // Busca transação antiga
    const oldTransaction = await this.transactionRepository.getById(
      transaction.uid
    );

    if (!oldTransaction) {
      throw new Error("Transação não encontrada");
    }

    // Atualiza transação
    const updatedTransaction = await this.transactionRepository.update(
      transaction
    );

    // Remove impacto antigo
    await this.monthlySummaryRepository.removeTransaction(oldTransaction);

    // Aplica impacto novo
    await this.monthlySummaryRepository.applyTransaction(updatedTransaction);

    const userSummary = await this.userSummaryRepository.getByUser(
      transaction.userUid
    );

    if (!userSummary) {
      throw new Error("Resumo do usuário não encontrado");
    }

    userSummary.removeTransaction(oldTransaction);
    userSummary.applyTransaction(updatedTransaction);

    const { uid, ...updateData } = userSummary;
    await this.userSummaryRepository.update(uid, updateData);

    return {
      transaction: TransactionMapper.toDTO(updatedTransaction),
      userSummary: UserSummaryMapper.toDTO(userSummary),
    };
  }
}
