import { Colors } from "@/constants/theme";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface EditUserModalProps {
  visible: boolean;
  onClose: () => void;
}

export function EditUserModal({ visible, onClose }: EditUserModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Modal de Edição</Text>
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
  },
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    width: "80%",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
    color: Colors.black,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: Colors["gray-200"],
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  closeText: {
    fontFamily: "Inter_500Medium",
    color: Colors.black,
  },
});
