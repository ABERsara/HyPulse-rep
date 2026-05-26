import { View, Text } from 'react-native';

export default function LiveScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#06b6d4', fontSize: 18, fontWeight: 'bold' }}>
        LIVE — Coming Soon
      </Text>
    </View>
  );
}
