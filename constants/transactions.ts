export const TRANSACTION_TYPES: { label: string; value: string }[] = [
  { label: "Depósito", value: "deposit" },
  { label: "Transferência", value: "transfer" },
  { label: "Boleto / Conta", value: "boleto" },
  { label: "Pix", value: "pix" },
  { label: "Cartão de Crédito", value: "credit_card" },
  { label: "Cartão de Débito", value: "debit_card" },
  { label: "Saque", value: "withdraw" },
  { label: "Outros", value: "other" },
];

export const TRANSACTION_CATEGORIES: { label: string; value: string }[] = [
  { value: "Alimentação", label: "Alimentação" },
  { value: "Transporte", label: "Transporte" },
  { value: "Moradia", label: "Moradia" },
  { value: "Lazer", label: "Lazer" },
  { value: "Saúde", label: "Saúde" },
  { value: "Educação", label: "Educação" },
  { value: "Trabalho", label: "Trabalho" },
  { value: "Outros", label: "Outros" },
];