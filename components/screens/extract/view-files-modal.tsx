import { Colors } from "@/constants/theme";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  listAll,
  ref,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ViewFilesModalProps {
  visible: boolean;
  onClose: () => void;
  transactionUid: string;
}

export function ViewFilesModal({
  visible,
  onClose,
  transactionUid,
}: ViewFilesModalProps) {
  const [files, setFiles] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) fetchFiles();
  }, [visible]);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const storage = getStorage();
      const listRef = ref(storage, `transactions/${transactionUid}`);
      const res = await listAll(listRef);

      const filesData = await Promise.all(
        res.items.map(async (item) => {
          const url = await getDownloadURL(item);
          return { name: item.name, url };
        })
      );

      setFiles(filesData);
    } catch (err) {
      console.log("Erro ao buscar arquivos:", err);
      setFiles([]);
    }
    setLoading(false);
  };

  const handleDeleteFile = async (fileName: string) => {
    try {
      const storage = getStorage();
      const fileRef = ref(
        storage,
        `transactions/${transactionUid}/${fileName}`
      );
      await deleteObject(fileRef);
      setFiles((prev) => prev.filter((f) => f.name !== fileName));
    } catch (err) {
      console.log("Erro ao deletar arquivo:", err);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Arquivos da Transação</Text>
          <ScrollView>
            {loading && <Text>Carregando arquivos...</Text>}
            {!loading && files.length === 0 && (
              <Text>Nenhum arquivo encontrado.</Text>
            )}
            {!loading &&
              files.map((file, idx) => (
                <View key={idx} style={styles.fileRow}>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(file.url)}
                    style={styles.fileButton}
                  >
                    <Text style={styles.fileText}>{file.name}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteFile(file.name)}
                  >
                    <Text style={styles.deleteText}>Deletar</Text>
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    backgroundColor: Colors.white,
    width: "95%",
    maxHeight: "70%",
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    marginBottom: 12,
  },
  fileRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomColor: Colors["gray-200"],
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  fileButton: {
    flex: 1,
  },
  fileText: {
    color: Colors["blue"],
    fontFamily: "Inter_500Medium",
  },
  deleteButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: Colors.error,
    borderRadius: 6,
    marginLeft: 8,
  },
  deleteText: {
    color: Colors.white,
    fontFamily: "Inter_500Medium",
    fontSize: 13,
  },
  closeButton: {
    marginTop: 12,
    backgroundColor: Colors["gray-300"],
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeText: {
    fontFamily: "Inter_500Medium",
    color: Colors.black,
  },
});
