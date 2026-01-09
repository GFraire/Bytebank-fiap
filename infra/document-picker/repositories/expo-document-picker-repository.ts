import { FileAttachment } from "@/domain/entities/file-attachment";
import { FileAttachmentRepository } from "@/domain/repositories/file-attachment-repository";
import * as DocumentPicker from "expo-document-picker";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";

export class ExpoFilePickerRepository implements FileAttachmentRepository {
  async pickFiles(): Promise<FileAttachment[]> {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["image/*", "application/pdf"],
      copyToCacheDirectory: true,
      multiple: true,
    });

    if (result.canceled || result.assets.length === 0) {
      return [];
    }

    return Promise.all(
      result.assets.map(async (asset) => {
        const response = await fetch(asset.uri);
        const blob = await response.blob();

        return {
          name: asset.name,
          uri: asset.uri,
          blob,
        };
      })
    );
  }

  async upload(transactionUid: string, file: FileAttachment): Promise<string> {
    const storage = getStorage();

    const fileRef = ref(storage, `transactions/${transactionUid}/${file.name}`);

    await uploadBytes(fileRef, file.blob);

    return getDownloadURL(fileRef);
  }

  async listByTransaction(
    transactionUid: string
  ): Promise<{ name: string; url: string }[]> {
    const storage = getStorage();
    const listRef = ref(storage, `transactions/${transactionUid}`);

    const res = await listAll(listRef);

    return Promise.all(
      res.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return {
          name: item.name,
          url,
        };
      })
    );
  }

  async delete(transactionUid: string, fileName: string): Promise<void> {
    const storage = getStorage();

    const fileRef = ref(storage, `transactions/${transactionUid}/${fileName}`);

    await deleteObject(fileRef);
  }
}
