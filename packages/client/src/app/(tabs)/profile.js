import { View, Text, Button } from 'react-native';
import LazyAuthModal from '../../components/LazyAuthModal.js';
import { useState } from 'react';

export default function ProfileScreen() {

  const [isVisible, setIsVisible] = useState(false);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#1a1a1a',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: '#fff', fontSize: 18 }}>Profile — Coming Soon</Text>

      <LazyAuthModal onClose={() => setIsVisible(false)} visible={isVisible}></LazyAuthModal>

    </View>
  );
}
