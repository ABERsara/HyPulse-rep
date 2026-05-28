import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const isGuest = !user;

  const login = async (userData, jwtToken) => {
    // TODO (T30): שמירת token ב-AsyncStorage, setUser(userData), setToken(jwtToken)
    console.log('[AuthContext] login נקרא — T30 ימממש זאת');
  };

  const logout = async () => {
    // TODO (T30): הסרת token מ-AsyncStorage, setUser(null), setToken(null)
    console.log('[AuthContext] logout נקרא — T30 ימממש זאת');
  };

  return (
    <AuthContext.Provider value={{ user, token, isGuest, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);