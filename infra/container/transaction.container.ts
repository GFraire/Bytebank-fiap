import { AddTransactionUseCase } from "@/application/use-cases/transaction/add-transaction-use-case";
import { DeleteTransactionUseCase } from "@/application/use-cases/transaction/delete-transaction-use-case";
import { GetTransactionsByUserUseCase } from "@/application/use-cases/transaction/get-transactions-by-user-use-case";
import { UpdateTransactionUseCase } from "@/application/use-cases/transaction/update-transaction-use-case";

import { FirebaseMonthlySummaryRepository } from "@/infra/firebase/repositories/firebase-monthly-summary-repository";
import { FirebaseTransactionRepository } from "@/infra/firebase/repositories/firebase-transaction-repository";
import { FirebaseUserSummaryRepository } from "@/infra/firebase/repositories/firebase-user-summary-repository";

const transactionRepository = new FirebaseTransactionRepository();
const monthlySummaryRepository = new FirebaseMonthlySummaryRepository();
const userSummaryRepository = new FirebaseUserSummaryRepository();

export const addTransactionUseCase = new AddTransactionUseCase(
  transactionRepository,
  userSummaryRepository,
  monthlySummaryRepository
);

export const updateTransactionUseCase = new UpdateTransactionUseCase(
  transactionRepository,
  monthlySummaryRepository,
  userSummaryRepository
);

export const deleteTransactionUseCase = new DeleteTransactionUseCase(
  transactionRepository,
  monthlySummaryRepository,
  userSummaryRepository
);

export const getTransactionsByUserUseCase = new GetTransactionsByUserUseCase(
  transactionRepository
);
