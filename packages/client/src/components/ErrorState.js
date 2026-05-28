import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ErrorState({ onRetry }) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>⚠️</Text>
      <Text style={styles.message}>Something went wrong</Text>
      <TouchableOpacity style={styles.btn} onPress={onRetry}>
        <Text style={styles.btnText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 40, marginBottom: 12 },
  message: { color: '#9ca3af', fontSize: 16, marginBottom: 20 },
  btn: { backgroundColor: '#374151', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: 'bold' },
});
