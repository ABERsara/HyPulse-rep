import { View, Text } from 'react-native';
import StreamCard from '../components/StreamCard';
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
  <View style={{ width: '100%' }}> 
        <StreamCard onPress={() => console.log('Card pressed!')} />
      </View>
    </View>
  );
}
