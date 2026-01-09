import { Transaction } from "@/domain/entities/transaction";
import { TransactionDTO } from "../dtos/transaction-dto";

export class TransactionMapper {
  static toDTO(transaction: Transaction): TransactionDTO {
    return {
      uid: transaction.uid,
      userUid: transaction.userUid,
      description: transaction.description,
      amount: transaction.amount,
      flow: transaction.flow,
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
      createdAt: transaction.createdAt,
    };
  }
}
