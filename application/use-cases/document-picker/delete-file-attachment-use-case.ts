import { FileAttachmentRepository } from "@/domain/repositories/file-attachment-repository";

export class DeleteFileAttachmentUseCase {
  constructor(private fileAttachmentRepository: FileAttachmentRepository) {}

  async execute(transactionUid: string, fileName: string): Promise<void> {
    await this.fileAttachmentRepository.delete(transactionUid, fileName);
  }
}
