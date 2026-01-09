import { FileAttachment } from "@/domain/entities/file-attatchment";
import { FileAttachmentDTO } from "../dtos/fille-attatchment-dto";

export class FileAttachmentMapper {
  static toDTO(fileAttachment: FileAttachment): FileAttachmentDTO {
    return {
      name: fileAttachment.name,
      uri: fileAttachment.uri,
      blob: fileAttachment.blob,
    };
  }
}
