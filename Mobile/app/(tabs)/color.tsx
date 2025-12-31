import { View, Text, StyleSheet } from "react-native";

export default function ColorScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chào mừng đến với ứng dụng!</Text>
      <Text style={styles.description}>Đây là trang Color.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    color: "#fff",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  description: { fontSize: 16, textAlign: "center" },
});
