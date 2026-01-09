import { Transaction } from "@/domain/entities/transaction";
import { MonthlySummaryRepository } from "@/domain/repositories/monthly-summary-repository";
import { TransactionRepository } from "@/domain/repositories/transaction-repository";
import { UserSummaryRepository } from "@/domain/repositories/user-summary-repository";

import { TransactionDTO } from "@/application/dtos/transaction-dto";
import { UserSummaryDTO } from "@/application/dtos/user-summary-dto";
import { TransactionMapper } from "@/application/mappers/transaction-mapper";
import { UserSummaryMapper } from "@/application/mappers/user-summary-mapper";

type AddTransactionInput = Omit<Transaction, "uid">;

export class AddTransactionUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private userSummaryRepository: UserSummaryRepository,
    private monthlySummaryRepository: MonthlySummaryRepository
  ) {}

  async execute(
    transaction: AddTransactionInput
  ): Promise<{ transaction: TransactionDTO; userSummary: UserSummaryDTO }> {
    if (!transaction.userUid) {
      throw new Error("Usuário é obrigatório");
    }

    if (transaction.amount <= 0) {
      throw new Error("Valor deve ser maior que zero");
    }

    // Criar transação
    const savedTransaction = await this.transactionRepository.add(transaction);

    // Atualizar resumo mensal
    await this.monthlySummaryRepository.applyTransaction(savedTransaction);

    // Atualizar resumo do usuário
    const userSummary = await this.userSummaryRepository.getByUser(
      transaction.userUid
    );

    if (!userSummary) {
      throw new Error("Resumo do usuário não encontrado");
    }

    userSummary.applyTransaction(savedTransaction);

    await this.userSummaryRepository.update(userSummary.uid, {
      totalIncome: userSummary.totalIncome,
      totalExpense: userSummary.totalExpense,
      balance: userSummary.balance,
    });

    return {
      transaction: TransactionMapper.toDTO(savedTransaction),
      userSummary: UserSummaryMapper.toDTO(userSummary),
    };
  }
}
