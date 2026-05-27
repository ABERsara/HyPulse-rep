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

  logout: async () => {
    try {
      await AsyncStorage.removeItem('userToken');
    } catch {
      // nothing to do if token removal failed
    }
  },
};
