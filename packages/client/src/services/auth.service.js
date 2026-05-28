/**
 * auth.service.js
 *
 * Authentication service — handles login, logout, and token storage in AsyncStorage.
 *
 * Communicates with: /api/users (login)
 * Depends on: AsyncStorage (token storage), fetch (HTTP requests)
 * Used by: LoginScreen and any screen that needs the current auth token
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/users`;

export const authService = {
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (data.token) {
      await AsyncStorage.setItem('userToken', data.token);
      return {
        token: data.token,
        user: data.user,
      };
    }

    throw new Error('No token received from server');
  },

  getToken: async () => {
    try {
      return await AsyncStorage.getItem('userToken');
    } catch {
      return null;
    }
  },

  isAuthenticated: async () => {
    const token = await authService.getToken();
    return token !== null;
  },

  loginWithFacebook: async () => {
    // TODO: requires expo-auth-session and firebase packages
    // Step 1: פתיחת חלון Facebook login
    // const result = await FacebookAuthProvider.signInWithPopup(...);

    // Step 2: קבלת Facebook access token
    // const { accessToken } = result.credential;

    // Step 3: המרה ל-Firebase credential
    // const firebaseCredential = FacebookAuthProvider.credential(accessToken);
    // const firebaseResult = await signInWithCredential(auth, firebaseCredential);
    // const firebaseToken = await firebaseResult.user.getIdToken();

    // Step 4: שליחה ל-loginWithSocial
    // return authService.loginWithSocial(firebaseToken);

    throw new Error(
      'loginWithFacebook: requires firebase and expo-auth-session setup (T40)'
    );
  },

  logout: async () => {
    try {
      await AsyncStorage.removeItem('userToken');
    } catch {
      // nothing to do if token removal failed
    }
  },
};
