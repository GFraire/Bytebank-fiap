import { BaseButton } from "@/components/base-button";
import DateField from "@/components/date-field";
import PickerField from "@/components/picker-field";
import TextField from "@/components/text-field";
import { Colors } from "@/constants/theme";
import {
  ITransaction,
  TRANSACTION_CATEGORIES,
  TRANSACTION_TYPES,
} from "@/hooks/useTransaction";
import { useToastStore } from "@/stores/toastStore";
import { useUserStore } from "@/stores/userStore";
import * as DocumentPicker from "expo-document-picker";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface EditTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  transaction: ITransaction;
}

export function EditTransactionModal({
  visible,
  onClose,
  transaction,
}: EditTransactionModalProps) {
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [type, setType] = useState(transaction.type);
  const [flow, setFlow] = useState(transaction.flow);
  const [category, setCategory] = useState(transaction.category);
  const [date, setDate] = useState(transaction.date);
  const [files, setFiles] = useState<
    { name: string; uri: string; blob: Blob }[]
  >([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const { addToast } = useToastStore();
  const { updateTransaction } = useUserStore();

  useEffect(() => {
    if (visible) {
      setDescription(transaction.description);
      setAmount(transaction.amount.toString());
      setType(transaction.type);
      setFlow(transaction.flow);
      setCategory(transaction.category);
      setDate(transaction.date);
      setFiles([]);
      setErrors({});
    }
  }, [visible, transaction]);

  const isFormFilled = [description, amount, type, flow, category, date].every(
    Boolean
  );

  // Selecionar arquivos
  const pickFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/*", "application/pdf"],
        copyToCacheDirectory: true,
      });

      if (result.type === "success") {
        const response = await fetch(result.uri);
        const blob = await response.blob();
        setFiles((prev) => [
          ...prev,
          { name: result.name, uri: result.uri, blob },
        ]);
      }
    } catch (err) {
      console.log("Erro ao selecionar arquivo:", err);
      addToast("Erro ao selecionar arquivo", "error");
    }
  };

  const uploadFileToFirebase = async (file: (typeof files)[0]) => {
    const storage = getStorage();
    const fileRef = ref(
      storage,
      `transactions/${transaction.uid}/${file.name}`
    );
    await uploadBytes(fileRef, file.blob);
    return getDownloadURL(fileRef);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const newErrors: Record<string, string> = {};

    if (!description) newErrors.description = "Descrição é obrigatória";
    if (!amount) newErrors.amount = "Valor é obrigatório";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const numericAmount = Number(amount.replace(/\./g, "").replace(",", "."));
      const uploadedFiles: string[] = [];

      for (const file of files) {
        const url = await uploadFileToFirebase(file);
        uploadedFiles.push(url);
      }

      // Atualiza a transação no store
      const { error } = await updateTransaction({
        ...transaction,
        description,
        amount: numericAmount,
        flow: flow as "income" | "expense",
        type,
        category,
        date: new Date(date).toISOString(),
        files: uploadedFiles,
      });

      if (error) {
        addToast("Erro ao atualizar transação: " + error, "error");
      } else {
        addToast("Transação atualizada com sucesso", "success");
        onClose();
      }
    } catch (err: any) {
      console.log(err);
      addToast("Erro ao fazer upload: " + err.message, "error");
    }

    setLoading(false);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <ScrollView
          contentContainerStyle={styles.container}
          style={{ width: "90%", borderRadius: 8 }}
        >
          <Text style={styles.title}>Editar Transação</Text>

          <TextField
            label="Descrição *"
            value={description}
            onChangeText={setDescription}
            error={errors.description}
          />
          <TextField
            label="Valor *"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            error={errors.amount}
          />
          <PickerField
            label="Fluxo *"
            value={flow}
            onValueChange={setFlow}
            options={[
              { label: "Entrada", value: "income" },
              { label: "Saída", value: "expense" },
            ]}
            error={errors.flow}
          />
          <PickerField
            label="Tipo de Transação *"
            value={type}
            onValueChange={setType}
            options={TRANSACTION_TYPES}
            error={errors.type}
          />
          <PickerField
            label="Categoria *"
            value={category}
            onValueChange={setCategory}
            options={TRANSACTION_CATEGORIES}
            error={errors.category}
          />
          <DateField
            label="Data *"
            value={new Date(date)}
            onChange={(d) => setDate(d.toISOString())}
            error={errors.date}
            maximumDate={new Date()}
          />

          <View style={styles.uploadSection}>
            <Text style={styles.uploadLabel}>Arquivos (PDF ou imagem)</Text>
            <BaseButton title="Selecionar arquivo" onPress={pickFiles} />
            {files.map((f, idx) => (
              <Text key={idx} style={styles.fileName}>
                {f.name}
              </Text>
            ))}
          </View>

          <View style={styles.buttonWrapper}>
            <BaseButton
              title="Salvar Alterações"
              onPress={handleSubmit}
              type="success"
              disabled={!isFormFilled || loading}
              loading={loading}
            />
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    paddingVertical: 20,
  },
  container: {
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: Colors.black,
    marginBottom: 16,
    textAlign: "center",
  },
  uploadSection: { marginVertical: 12 },
  uploadLabel: { fontFamily: "Inter_500Medium", marginBottom: 8 },
  fileName: { fontFamily: "Inter_400Regular", fontSize: 12, marginTop: 4 },
  buttonWrapper: { marginTop: 16 },
  closeButton: {
    marginTop: 12,
    backgroundColor: Colors["gray-300"],
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeText: { fontFamily: "Inter_500Medium", color: Colors.black },
});
