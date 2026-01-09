import { TransactionDTO } from "@/application/dtos/transaction-dto";
import { Colors } from "@/constants/theme";
import { useAuthStore } from "@/stores/auth-user-store";
import { useToastStore } from "@/stores/toastStore";
import { useTransactionsStore } from "@/stores/transactions-store";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  findNodeHandle,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { DeleteConfirmModal } from "./delete-confirm-modal";
import { EditTransactionModal } from "./edit-user-modal";
import { OptionsMenu } from "./options-menu";
import { ViewFilesModal } from "./view-files-modal";

interface IListItemProps {
  transaction: TransactionDTO;
}

export function ListItem({ transaction }: IListItemProps) {
  const color = transaction.flow === "income" ? Colors.green : Colors.error;
  const icon = transaction.flow === "income" ? "arrow-up" : "arrow-down";

  const formattedValue = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(transaction.amount);

  const formattedDate = new Date(transaction.date).toLocaleDateString("pt-BR");
  const signal = transaction.flow === "income" ? "+" : "-";

  const [menuVisible, setMenuVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [viewFilesVisible, setViewFilesVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  const iconRef = useRef<View>(null);

  const { remove } = useTransactionsStore();
  const { addToast } = useToastStore();
  const { updateSummary } = useAuthStore();

  function openMenu() {
    if (iconRef.current) {
      const handle = findNodeHandle(iconRef.current);
      if (handle) {
        UIManager.measure(handle, (_, __, width, height, pageX, pageY) => {
          setMenuPosition({ x: pageX + width, y: pageY + height });
          setMenuVisible(true);
        });
      }
    }
  }

  const handleDeleteConfirm = async () => {
    const { error } = await remove(transaction);

    if (error) addToast("Erro ao deletar: " + error, "error");

    setDeleteVisible(false);
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemRow}>
        <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{transaction.description}</Text>
          <Text style={styles.subtitleText}>{transaction.category}</Text>
          <Text style={styles.subtitleText}>{formattedDate}</Text>
        </View>
      </View>

      <View style={styles.amountRow}>
        <Text style={[styles.amountText, { color }]}>
          {signal}
          {formattedValue}
        </Text>

        <TouchableOpacity ref={iconRef} onPress={openMenu}>
          <Ionicons
            name="ellipsis-vertical"
            size={18}
            color={Colors["gray-500"]}
          />
        </TouchableOpacity>
      </View>

      {/* Menu de opções */}
      <OptionsMenu
        visible={menuVisible}
        position={menuPosition}
        onClose={() => setMenuVisible(false)}
        onEdit={() => {
          setMenuVisible(false);
          setEditVisible(true);
        }}
        onDelete={() => {
          setMenuVisible(false);
          setDeleteVisible(true);
        }}
        onViewFiles={() => {
          setMenuVisible(false);
          setViewFilesVisible(true);
        }}
      />

      {/* Modal de edição */}
      <EditTransactionModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        transaction={transaction}
      />

      {/* Modal de exclusão */}
      <DeleteConfirmModal
        visible={deleteVisible}
        onClose={() => setDeleteVisible(false)}
        onConfirm={handleDeleteConfirm}
      />

      <ViewFilesModal
        visible={viewFilesVisible}
        onClose={() => setViewFilesVisible(false)}
        transactionUid={transaction.uid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    borderColor: Colors["gray-200"],
    borderTopWidth: 1,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  iconContainer: {
    borderRadius: 8,
    padding: 4,
  },
  textContainer: {
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: Colors.black,
  },
  subtitleText: {
    fontSize: 13,
    color: Colors["gray-600"],
    fontFamily: "Inter_400Regular",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
  },
  amountText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
});
