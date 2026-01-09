import { FileAttachmentDTO } from "@/application/dtos/file-attachment-dto";
import { FileAttachmentRepository } from "@/domain/repositories/file-attachment-repository";

export class PickFilesUseCase {
  constructor(private fileAttachmentRepository: FileAttachmentRepository) {}

  async execute(): Promise<FileAttachmentDTO[]> {
    return await this.fileAttachmentRepository.pickFiles();
  }
}
