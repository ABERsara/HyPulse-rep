import { View, Text, StyleSheet } from 'react-native';

export default function EmptyFeed() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📡</Text>
      <Text style={styles.title}>No live streams right now</Text>
      <Text style={styles.subtitle}>Check back soon!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  subtitle: { color: '#9ca3af', fontSize: 14, marginTop: 8 },
});
