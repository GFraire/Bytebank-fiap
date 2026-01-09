import { FileAttachment } from "@/domain/entities/file-attachment";
import { FileAttachmentRepository } from "@/domain/repositories/file-attachment-repository";

export class UploadFileAttachmentUseCase {
  constructor(
    private storageRepository: FileAttachmentRepository
  ) {}

  async execute(
    transactionUid: string,
    file: FileAttachment
  ): Promise<string> {
    return this.storageRepository.upload(transactionUid, file);
  }
}
