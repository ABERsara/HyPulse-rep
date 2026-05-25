/* eslint-disable no-unused-vars */
import AsyncStorage from '@react-native-async-storage/async-storage';

export const birthdayService = {
  hasDateOfBirth: (user) => {
    // TODO (T42): return !!user?.dateOfBirth
    return false;
  },

  shouldShowPopup: async (user) => {
    // TODO (T42): לבדוק אם user.dateOfBirth קיים, להחזיר true אם חסר
    return !birthdayService.hasDateOfBirth(user);
  },

  saveBirthday: async (dateOfBirth) => {
    // TODO (T42): PATCH /api/users/me/birthday עם JWT token
    console.log('[birthdayService] saveBirthday called with:', dateOfBirth);
  },
};
