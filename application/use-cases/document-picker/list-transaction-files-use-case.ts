import { FileAttachmentRepository } from "@/domain/repositories/file-attachment-repository";
import { StoredFile } from "@/domain/types/stored-file";

export class ListTransactionFilesUseCase {
  constructor(private fileQueryRepository: FileAttachmentRepository) {}

  async execute(transactionUid: string): Promise<StoredFile[]> {
    return this.fileQueryRepository.listByTransaction(transactionUid);
  }
}
