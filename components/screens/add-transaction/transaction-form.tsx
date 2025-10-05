import DateField from "@/components/date-field";
import PickerField from "@/components/picker-field";
import TextField from "@/components/text-field";
import { Colors } from "@/constants/theme";
import {
  TRANSACTION_CATEGORIES,
  TRANSACTION_TYPES,
} from "@/hooks/useTransaction";
import { useUserStore } from "@/stores/userStore";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function TransactionForm() {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState(TRANSACTION_TYPES[0].value || "");
  const [flow, setFlow] = useState("income");
  const [category, setCategory] = useState(TRANSACTION_CATEGORIES[0].value);
  const [date, setDate] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { user, addTransaction } = useUserStore();

  async function handleSubmit() {
    const newErrors: Record<string, string> = {};

    if (!description) newErrors.description = "Descrição é obrigatória";

    if (!amount) {
      newErrors.amount = "Valor é obrigatório";
    } else {
      const numericAmount = Number(amount.replace(/\./g, "").replace(",", "."));

      if (isNaN(numericAmount)) {
        newErrors.amount = "Valor inválido";
      } else if (numericAmount > 9999999.99) {
        newErrors.amount = "Valor máximo permitido é R$ 9.999.999,99";
      } else if (numericAmount < 0) {
        newErrors.amount = "Valor deve ser maior que 0";
      }
      // Verifica casas decimais
      else {
        const decimalPart = amount.split(",")[1];
        if (decimalPart && decimalPart.length > 2) {
          newErrors.amount = "Máximo de duas casas decimais";
        }
      }
    }

    if (!type) newErrors.type = "Tipo é obrigatório";
    if (!category) newErrors.category = "Categoria é obrigatória";
    if (!flow) newErrors.flow = "Fluxo é obrigatório";
    if (!date) newErrors.date = "Data é obrigatória";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const { error } = await addTransaction({
      uid: user?.uid || "",
      description,
      amount: Number(amount.replace(/\./g, "").replace(",", ".")),
      flow: flow as "income" | "expense",
      type,
      category,
      createdAt: new Date().toISOString(),
      date: new Date(date).toISOString(),
    });

    clearForm();
  }

  function clearForm() {
    setDescription("");
    setAmount("");
    setType(TRANSACTION_TYPES[0].value);
    setFlow("income");
    setCategory(TRANSACTION_CATEGORIES[0].value);
    setDate("");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.wrapper}>
        {/* Primeira linha */}
        <TextField
          label="Descrição *"
          error={errors.description}
          placeholder="Ex: Supermercado, Salário..."
          value={description}
          onChangeText={setDescription}
        />

        {/* Segunda linha */}
        <TextField
          label="Valor *"
          value={amount}
          onChangeText={setAmount}
          placeholder="R$ 0,00"
          keyboardType="numeric"
          error={errors.amount}
        />

        {/* Terceira linha */}
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

        {/* Quarta linha */}
        <PickerField
          label="Categoria *"
          value={category}
          onValueChange={setCategory}
          options={TRANSACTION_CATEGORIES}
          error={errors.category}
        />

        {/* Quinta linha */}
        <DateField
          label="Data *"
          value={date ? new Date(date) : null}
          onChange={(d) => setDate(d.toISOString())}
          error={errors.date}
          maximumDate={new Date()} // não permite datas futuras
        />

        {/* Botão */}
        <View style={styles.buttonWrapper}>
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Adicionar Transação</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  wrapper: {
    padding: 16,
    backgroundColor: Colors["gray-100"],
    borderRadius: 12,
    borderColor: Colors["gray-200"],
    borderWidth: 1,
  },
  buttonWrapper: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  button: {
    backgroundColor: Colors["green-btn"],
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,

    elevation: 2,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
});
