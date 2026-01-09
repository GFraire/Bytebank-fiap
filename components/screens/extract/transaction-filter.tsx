import { BaseButton } from "@/components/base-button";
import DateField from "@/components/date-field";
import PickerField from "@/components/picker-field";
import TextField from "@/components/text-field";
import { Colors } from "@/constants/theme";
import { TRANSACTION_CATEGORIES, TRANSACTION_TYPES } from "@/constants/transactions";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const PERIOD_OPTIONS = [
  { label: "Hoje", value: "today" },
  { label: "Últimos 7 dias", value: "last7" },
  { label: "Últimos 30 dias", value: "last30" },
  { label: "Últimos 90 dias", value: "las90" },
  { label: "Este mês", value: "thisMonth" },
  { label: "Este ano", value: "thisYear" },
  { label: "Personalizado", value: "custom" },
];

interface TransactionFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onFilter: (filters: any) => void;
}

export function TransactionFilterModal({
  visible,
  onClose,
  onFilter,
}: TransactionFilterModalProps) {
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [period, setPeriod] = useState("thisYear");
  const [customDate, setCustomDate] = useState<Date | null>(null);

  function handleApply() {
    let dateRange;
    const today = new Date();

    switch (period) {
      case "today":
        dateRange = { start: today, end: today };
        break;
      case "last7":
        dateRange = {
          start: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
          end: today,
        };
        break;
      case "last30":
        dateRange = {
          start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000),
          end: today,
        };
        break;
      case "last90":
        dateRange = {
          start: new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000),
          end: today,
        };
        break;
      case "thisMonth":
        dateRange = {
          start: new Date(today.getFullYear(), today.getMonth(), 1),
          end: today,
        };
        break;
      case "thisYear":
        dateRange = {
          start: new Date(today.getFullYear(), 1, 1),
          end: today,
        };
        break;
      case "custom":
        dateRange = customDate ? { start: customDate, end: customDate } : null;
        break;
      default:
        dateRange = null;
    }

    onFilter({
      description,
      type,
      category,
      dateRange,
    });

    onClose(); // fecha o modal após aplicar filtro
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header do modal */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filtrar</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close-outline" size={28} color={Colors.black} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.wrapper}>
            <TextField
              label="Descrição"
              placeholder="Ex: Supermercado, Salário..."
              value={description}
              onChangeText={setDescription}
            />

            <PickerField
              label="Tipo"
              value={type}
              onValueChange={setType}
              options={[{ label: "Todos", value: "" }, ...TRANSACTION_TYPES]}
            />

            <PickerField
              label="Categoria"
              value={category}
              onValueChange={setCategory}
              options={[
                { label: "Todas", value: "" },
                ...TRANSACTION_CATEGORIES,
              ]}
            />

            <PickerField
              label="Período"
              value={period}
              onValueChange={setPeriod}
              options={PERIOD_OPTIONS}
            />

            {period === "custom" && (
              <DateField
                label="Escolher data"
                value={customDate}
                onChange={setCustomDate}
                maximumDate={new Date()}
              />
            )}

            <View style={styles.buttonWrapper}>
              <BaseButton
                title="Aplicar Filtro"
                onPress={handleApply}
                type="primary"
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
  },
  wrapper: {
    paddingBottom: 16,
  },
  buttonWrapper: {
    marginTop: 16,
    alignItems: "flex-end",
  },
});
