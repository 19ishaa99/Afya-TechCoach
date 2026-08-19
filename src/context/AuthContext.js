import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';
import { tokenStorage } from '../storage/tokenStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isRestoring, setIsRestoring] = useState(true);

  const restoreSession = useCallback(async () => {
    try {
      const token = await tokenStorage.getAccessToken();
      if (token) setUser(await authApi.me());
    } catch (_) {
      await tokenStorage.clear();
      setUser(null);
    } finally {
      setIsRestoring(false);
    }
  }, []);

  useEffect(() => { restoreSession(); }, [restoreSession]);

  const signIn = useCallback(async (credentials, remember = true) => {
    await authApi.login(credentials, remember);
    const authenticatedUser = await authApi.me();
    setUser(authenticatedUser);
    return authenticatedUser;
  }, []);

  const signOut = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isRestoring, signIn, signOut, restoreSession }),
    [user, isRestoring, signIn, signOut, restoreSession]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
