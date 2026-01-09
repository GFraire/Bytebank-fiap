import { CreateUserSummaryUseCase } from "@/application/use-cases/user-summary/create-user-summary-use-case";
import { GetUserSummaryUseCase } from "@/application/use-cases/user-summary/get-user-summary-use-case";
import { UpdateUserSummaryUseCase } from "@/application/use-cases/user-summary/update-user-summary-use-case";

import { FirebaseUserSummaryRepository } from "@/infra/firebase/repositories/firebase-user-summary-repository";

const userSummaryRepository = new FirebaseUserSummaryRepository();

export const getUserSummaryUseCase = new GetUserSummaryUseCase(
  userSummaryRepository
);

export const createUserSummaryUseCase = new CreateUserSummaryUseCase(
  userSummaryRepository
);

export const updateUserSummaryUseCase = new UpdateUserSummaryUseCase(
  userSummaryRepository
);
