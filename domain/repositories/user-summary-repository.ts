import { UserSummary } from "../entities/user-summary";

export interface UserSummaryRepository {
  create(uid: string): Promise<void>;
  getByUser(uid: string): Promise<UserSummary | null>;
  update(uid: string, updates: Partial<UserSummary>): Promise<UserSummary>;
}
