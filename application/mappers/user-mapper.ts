import { User } from "@/domain/entities/user";
import { UserDTO } from "../dtos/user-dto";

export class UserMapper {
  static toDTO(user: User): UserDTO {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      balance: user.balance,
      totalIncome: user.totalIncome,
      totalExpense: user.totalExpense,
    };
  }
}
