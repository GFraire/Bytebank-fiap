import { LoginUserUseCase } from "@/application/use-cases/auth/login-user-use-case";
import { LogoutUserUseCase } from "@/application/use-cases/auth/logout-user-user-case";
import { SignUpUserUseCase } from "@/application/use-cases/auth/sign-up-user-use-case";

import { FirebaseAuthRepository } from "@/infra/firebase/repositories/firebase-auth-repository";
import { FirebaseUserSummaryRepository } from "@/infra/firebase/repositories/firebase-user-summary-repository";

const authRepository = new FirebaseAuthRepository();
const userSummaryRepository = new FirebaseUserSummaryRepository();

export const loginUserUseCase = new LoginUserUseCase(
  authRepository,
  userSummaryRepository
);

export const logoutUserUseCase = new LogoutUserUseCase(authRepository);

export const signUpUserUseCase = new SignUpUserUseCase(
  authRepository,
  userSummaryRepository
);
