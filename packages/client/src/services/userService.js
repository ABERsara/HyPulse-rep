import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem('userToken');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const userService = {
  getMe: async () => {
    const headers = await getAuthHeader();
    const response = await fetch(`${BASE_URL}/api/users/profile`, { headers });
    if (!response.ok) throw new Error('Failed to fetch user');
    return response.json();
  },

  updateBirthday: async (dateOfBirth) => {
    const headers = await getAuthHeader();
    const response = await fetch(`${BASE_URL}/api/users/me/birthday`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ dateOfBirth }),
    });
    if (!response.ok) throw new Error('Failed to update birthday');
    return response.json();
  },
};
