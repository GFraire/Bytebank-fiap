import { FileAttachment } from "@/domain/entities/file-attachment";
import { FileAttachmentDTO } from "../dtos/file-attachment-dto";

export class FileAttachmentMapper {
  static toDTO(fileAttachment: FileAttachment): FileAttachmentDTO {
    return {
      name: fileAttachment.name,
      uri: fileAttachment.uri,
      blob: fileAttachment.blob,
    };
  }
}
