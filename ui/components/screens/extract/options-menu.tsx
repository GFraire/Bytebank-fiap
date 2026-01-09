import { Colors } from "@/ui/constants/theme";
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface OptionsMenuProps {
  visible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewFiles?: () => void;
}

export function OptionsMenu({
  visible,
  position,
  onClose,
  onEdit,
  onDelete,
  onViewFiles
}: OptionsMenuProps) {
  // Posição ajustada para não sair da tela
  const screenHeight = Dimensions.get("window").height;
  const menuHeight = 40;
  const showAbove = position.y + menuHeight > screenHeight - 20;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <View
          style={[
            styles.menuContainer,
            {
              top: showAbove ? position.y - menuHeight : position.y - 20,
              left: Math.max(position.x - 124, 10),
            },
          ]}
        >
          <TouchableOpacity style={styles.menuItem} onPress={onEdit}>
            <Text style={styles.menuText}>Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={onDelete}>
            <Text style={[styles.menuText, { color: Colors.error }]}>
              Excluir
            </Text>
          </TouchableOpacity>

          {onViewFiles && (
            <TouchableOpacity style={styles.menuItem} onPress={onViewFiles}>
              <Text style={styles.menuText}>Ver arquivos</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  menuContainer: {
    position: "absolute",
    backgroundColor: Colors.white,
    borderRadius: 8,
    paddingVertical: 4,
    width: 140,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 15,
    color: Colors.black,
    fontFamily: "Inter_500Medium",
  },
});
