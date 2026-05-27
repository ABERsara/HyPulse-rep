import { Modal, View, Text, TouchableOpacity } from 'react-native';

export default function LazyAuthModal({ visible, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: '#1f2937', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 24 }}>
          <TouchableOpacity onPress={onClose}>
            <Text>✕</Text>
          </TouchableOpacity>
          <Text>Registration</Text>
          <TouchableOpacity><Text>Continue with Google</Text></TouchableOpacity>
          <TouchableOpacity><Text>Continue with Apple</Text></TouchableOpacity>
          <TouchableOpacity><Text>Continue with Facebook</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
