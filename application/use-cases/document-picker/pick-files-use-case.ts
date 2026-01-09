import { FileAttachmentDTO } from "@/application/dtos/fille-attatchment-dto";
import { FileAttachmentRepository } from "@/domain/repositories/file-attachment-repository";

export class PickFilesUseCase {
  constructor(private fileAttatchmentRepository: FileAttachmentRepository) {}

  async execute(): Promise<FileAttachmentDTO[]> {
    return await this.fileAttatchmentRepository.pickFiles();
  }
}
