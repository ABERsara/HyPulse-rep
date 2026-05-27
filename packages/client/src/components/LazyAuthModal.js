import { Modal, View, Text, TouchableOpacity } from 'react-native';

export default function LazyAuthModal({ visible, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{backgroundColor:'white'}}>
        <Text>Registration</Text>
        <TouchableOpacity><Text>Continue with Google</Text></TouchableOpacity>
        <TouchableOpacity><Text>Continue with Apple</Text></TouchableOpacity>
        <TouchableOpacity><Text>Continue with Facebook</Text></TouchableOpacity>
        <TouchableOpacity onPress={onClose}>
          <Text>✕</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
