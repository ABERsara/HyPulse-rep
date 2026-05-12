import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import PropTypes from 'prop-types';
import { useStripe } from '@stripe/stripe-react-native';
import { authService } from '../services/auth.service';
import { useSelector, useDispatch } from 'react-redux';
import { updateBalances } from '../store/slices/walletSlice';

const ShopScreen = ({ userId, onLogout }) => {
  const dispatch = useDispatch();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [loading, setLoading] = useState(false);
  const [fetchingBalance, setFetchingBalance] = useState(true);

  // Redux sync — wallet and score are read here and auto-updated via socket middleware
  const coins = useSelector((state) => state.wallet.walletBalance || 0);
  const scores = useSelector((state) => state.wallet.scoresByGame || {});

  // ========================================
  // Fetch profile and sync balances into Redux
  // ========================================
  const fetchAndSyncBalance = async () => {
    try {
      const token = await authService.getToken();
      if (!token) {
        onLogout();
        return;
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/users/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 401 || response.status === 403) {
        await authService.logout();
        onLogout();
        return;
      }

      const data = await response.json();

      dispatch(
        updateBalances({
          walletCoins: data.walletCoins || data.walletBalance,
          scoresByGame: data.scoresByGame || {},
        })
      );
    } catch (e) {
      console.error('Fetch balance error:', e);
    }
  };

  useEffect(() => {
    const initializeScreen = async () => {
      setFetchingBalance(true);
      await fetchAndSyncBalance();
      setFetchingBalance(false);
    };

    initializeScreen();
  }, [userId]);

  const buyPackage = async (amount) => {
    setLoading(true);
    try {
      const token = await authService.getToken();
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/payments/create-sheet`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, coins: amount }),
        }
      );

      const data = await response.json();
      const { paymentIntent, ephemeralKey, customer } = data;

      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'WorldPlay',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: false,
        appearance: { colors: { primary: '#ffa502' } },
      });

      if (initError) throw initError;

      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) {
        // user cancelled or payment failed — no action needed
      } else {
        Alert.alert('Success!', 'Payment complete. Balance will update in a few seconds...');
        setTimeout(fetchAndSyncBalance, 3000);
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const triggerTestAnswer = async () => {
    try {
      const token = await authService.getToken();
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/user-answers/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            questionId: 'c5d5074e-395b-404a-8c7d-0eef8c24f694',
            selectedOptionId: '1910647f-5d69-4187-a376-5ba35c1da772',
            wager: 10,
          }),
        }
      );

      const data = await response.json();

      if (data.answer) {
        // Balance is auto-updated via socket middleware; fetchAndSyncBalance is a fallback
        fetchAndSyncBalance();
      }
    } catch (err) {
      Alert.alert('Test error', err.message);
    }
  };

  if (fetchingBalance) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffa502" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Coin Store</Text>

      <View style={styles.statsContainer}>
        <Text style={styles.balance}>
          Balance: {Number(coins || 0).toFixed(2)} coins
        </Text>
        <Text style={styles.scoreText}>
          Active score: {Number(Object.values(scores)[0] || 0).toFixed(2)} pts
        </Text>
      </View>

      <TouchableOpacity style={styles.testButton} onPress={triggerTestAnswer}>
        <Text style={styles.testButtonText}>
          Test sync (bet 10 coins)
        </Text>
      </TouchableOpacity>

      <View style={styles.packageContainer}>
        <PackageCard
          title="10 Coins"
          price="₪10"
          onPress={() => buyPackage(10)}
          disabled={loading}
        />
        <PackageCard
          title="50 Coins"
          price="₪50"
          popular
          onPress={() => buyPackage(50)}
          disabled={loading}
        />
        <PackageCard
          title="100 Coins"
          price="₪100"
          onPress={() => buyPackage(100)}
          disabled={loading}
        />
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ff4757" />
          <Text style={styles.loadingText}>Processing payment...</Text>
        </View>
      )}
    </View>
  );
};

const PackageCard = ({ title, price, onPress, disabled, popular }) => (
  <TouchableOpacity
    style={[styles.packageCard, popular && styles.popular]}
    onPress={onPress}
    disabled={disabled}
  >
    {popular && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Most popular!</Text>
      </View>
    )}
    <Text style={styles.packageTitle}>{title}</Text>
    <Text style={styles.packagePrice}>{price}</Text>
    {popular && (
      <Text style={styles.bonusText}>(First purchase bonus x2!)</Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statsContainer: { marginBottom: 20 },
  balance: {
    fontSize: 24,
    color: '#ffa502',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  scoreText: { fontSize: 16, color: '#ccc', textAlign: 'center', marginTop: 5 },
  logoutBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: '#ff4757',
    padding: 10,
    borderRadius: 8,
  },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  packageContainer: { gap: 15 },
  packageCard: {
    backgroundColor: '#2f3542',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    position: 'relative',
  },
  popular: { borderColor: '#ffa502', borderWidth: 2 },
  badge: {
    position: 'absolute',
    top: -12,
    backgroundColor: '#ffa502',
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  badgeText: { fontSize: 12, fontWeight: 'bold', color: '#000' },
  packageTitle: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  packagePrice: { fontSize: 22, color: '#ffa502', fontWeight: 'bold' },
  bonusText: { fontSize: 12, color: '#2ed573', marginTop: 5 },
  loadingOverlay: { marginTop: 20, alignItems: 'center' },
  loadingText: { color: '#fff', marginTop: 10 },
  testButton: {
    backgroundColor: '#535c68',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffa502',
    borderStyle: 'dashed',
  },
  testButtonText: { color: '#ffa502', textAlign: 'center', fontWeight: 'bold' },
});

PackageCard.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  popular: PropTypes.bool,
};

ShopScreen.propTypes = {
  userId: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default ShopScreen;
