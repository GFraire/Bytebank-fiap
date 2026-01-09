import { TransactionDTO } from "@/application/dtos/transaction-dto";
import { TransactionRepository } from "@/domain/repositories/transaction-repository";

export class GetTransactionsByUserUseCase {
  constructor(private transactionRepository: TransactionRepository) {}

  async execute(
    userUid: string,
    pageSize = 6,
    startAfterDoc?: any
  ): Promise<{ transactions: TransactionDTO[]; lastDoc?: any }> {
    if (!userUid) throw new Error("Usuário não autenticado.");
    
    return this.transactionRepository.getByUser(
      userUid,
      pageSize,
      startAfterDoc
    );
  }
}
