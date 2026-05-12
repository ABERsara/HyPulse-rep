import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store/index';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function RootLayout() {
  return (
    // Redux Provider — initializes socket middleware on startup
    <Provider store={store}>
      {/* Stripe Provider — enables payment sheets throughout the app */}
      <StripeProvider
        publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}
        merchantIdentifier="merchant.com.worldplay"
      >
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#1a1a1a' },
          }}
        />
      </StripeProvider>
    </Provider>
  );
}
