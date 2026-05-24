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
import { handleResponse } from './apiHelpers';

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/users`;
const AUTH_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/auth`;

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
        user: data.user, // { id, name, username, email, role }
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

  logout: async () => {
    try {
      await AsyncStorage.removeItem('userToken');
    } catch {
      // nothing to do if token removal failed
    }
  },

  loginWithSocial: async (firebaseToken) => {
    const response = await fetch(`${AUTH_URL}/social`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firebaseToken }),
    });

    const data = await handleResponse(response);

    if (data.token) {
      await AsyncStorage.setItem('userToken', data.token);
      return { token: data.token, user: data.user };
    }

    throw new Error('No token received from server');
  },

  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      return token !== null;
    } catch {
      return false;
    }
  },
};
