import { DeleteFileAttachmentUseCase } from "@/application/use-cases/document-picker/delete-file-attachment-use-case";
import { ListTransactionFilesUseCase } from "@/application/use-cases/document-picker/list-transaction-files-use-case";
import { PickFilesUseCase } from "@/application/use-cases/document-picker/pick-files-use-case";
import { UploadFileAttachmentUseCase } from "@/application/use-cases/document-picker/upload-file-attachment-use-case";
import { ExpoFilePickerRepository } from "../document-picker/repositories/expo-document-picker-repository";

const filePickerRepository = new ExpoFilePickerRepository();

export const pickFilesUseCase = new PickFilesUseCase(filePickerRepository);

export const uploadFileAttachmentUseCase = new UploadFileAttachmentUseCase(
  filePickerRepository
);

export const listTransactionFilesUseCase = new ListTransactionFilesUseCase(
  filePickerRepository
);

export const deleteFileAttachmentUseCase = new DeleteFileAttachmentUseCase(
  filePickerRepository
);
