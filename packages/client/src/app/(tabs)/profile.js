import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { authService } from '../../services/auth.service';

export default function ProfileScreen() {
  const router = useRouter();

  const handleSignOut = async () => {
    await authService.logout();
    // TODO: להסיר כשה-AuthContext יהיה מוכן — הוא יטפל בניווט אוטומטית
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.avatar} />

      <Text style={styles.username}>Username</Text>

      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>Wallet</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.signOutButton]}
        onPress={handleSignOut}
      >
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#3a3a3a',
    marginBottom: 8,
  },
  username: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#06b6d4',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 24,
    width: 200,
    alignItems: 'center',
  },
  signOutButton: {
    backgroundColor: '#3a3a3a',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
