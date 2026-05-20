import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const MOCK_STREAM = {
  id: '1',
  title: 'Live Trivia Night 🎉',
  viewerCount: 1243,
  host: { username: 'host_name', avatarUrl: 'https://placekitten.com/80/80' },
  thumbnailUrl: 'https://placekitten.com/400/220',
};

export default function StreamCard({ stream = MOCK_STREAM, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={{ uri: stream.thumbnailUrl }} style={styles.thumbnail} />
      <View style={styles.liveBadge}><Text style={styles.liveText}>LIVE</Text></View>
      <View style={styles.info}>
        <Text style={styles.title}>{stream.title}</Text>
        <Text style={styles.host}>@{stream.host.username}</Text>
        <Text style={styles.viewers}>👁 {stream.viewerCount}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1f2937', borderRadius: 12, marginBottom: 12, overflow: 'hidden' },
  thumbnail: { width: '100%', height: 180 },
  liveBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#ff4757', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  liveText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  info: { padding: 12 },
  title: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  host: { color: '#9ca3af', fontSize: 13, marginTop: 4 },
  viewers: { color: '#9ca3af', fontSize: 13, marginTop: 2 },
});