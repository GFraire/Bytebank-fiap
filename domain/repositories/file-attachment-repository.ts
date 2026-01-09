import { FileAttachment } from "../entities/file-attatchment";
import { StoredFile } from "../types/stored-file";

export interface FileAttachmentRepository {
  pickFiles(): Promise<FileAttachment[]>;
  upload(transactionUid: string, file: FileAttachment): Promise<string>;
  listByTransaction(transactionUid: string): Promise<StoredFile[]>;
  delete(transactionUid: string, fileName: string): Promise<void>;
}
