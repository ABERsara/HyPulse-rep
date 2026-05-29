import PropTypes from 'prop-types';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
export default function BirthdayModal({ visible, onConfirm }) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>When is your birthday?</Text>
          {/* TODO T14b: להחליף ב-DateTimePicker אמיתי */}
          <View style={styles.pickerPlaceholder}>
            <Text style={styles.placeholderText}>[ Date Picker ]</Text>
          </View>
          <TouchableOpacity style={styles.btn} onPress={() => onConfirm(null)}>
            <Text style={styles.btnText}>Approval</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
BirthdayModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: '#1f2937',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  pickerPlaceholder: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  placeholderText: { color: '#6b7280' },
  btn: {
    backgroundColor: '#06b6d4',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
