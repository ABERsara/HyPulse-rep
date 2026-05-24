// TODO: החלפה ב-FeedScreen כשרותי תסיים (תלות T18)
import { View, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontSize: 18 }}>
        Home Feed — Coming Soon
      </Text>
    </View>
  );
}
