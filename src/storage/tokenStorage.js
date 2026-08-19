import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS_TOKEN = 'afya_access_token';
const REFRESH_TOKEN = 'afya_refresh_token';
let sessionTokens = null;

const sessionStorage = {
  get: key => Platform.OS === 'web' ? globalThis.sessionStorage?.getItem(key) || null : sessionTokens?.[key] || null,
  set: (key, value) => {
    if (Platform.OS === 'web') globalThis.sessionStorage?.setItem(key, value);
    else sessionTokens = { ...(sessionTokens || {}), [key]: value };
  },
  clear: () => {
    if (Platform.OS === 'web') {
      globalThis.sessionStorage?.removeItem(ACCESS_TOKEN);
      globalThis.sessionStorage?.removeItem(REFRESH_TOKEN);
    }
    sessionTokens = null;
  }
};

const storage = {
  get: key => Platform.OS === 'web'
    ? Promise.resolve(globalThis.localStorage?.getItem(key) || null)
    : SecureStore.getItemAsync(key),
  set: (key, value) => Platform.OS === 'web'
    ? Promise.resolve(globalThis.localStorage?.setItem(key, value))
    : SecureStore.setItemAsync(key, value),
  remove: key => Platform.OS === 'web'
    ? Promise.resolve(globalThis.localStorage?.removeItem(key))
    : SecureStore.deleteItemAsync(key)
};

export const tokenStorage = {
  isSessionOnly: () => Boolean(sessionStorage.get(REFRESH_TOKEN)),
  getAccessToken: async () => sessionStorage.get(ACCESS_TOKEN) || storage.get(ACCESS_TOKEN),
  getRefreshToken: async () => sessionStorage.get(REFRESH_TOKEN) || storage.get(REFRESH_TOKEN),
  save: async ({ access_token, refresh_token }, persistent = true) => {
    if (!access_token || !refresh_token) throw new Error('The server returned an invalid session.');
    if (!persistent) {
      await Promise.all([storage.remove(ACCESS_TOKEN), storage.remove(REFRESH_TOKEN)]);
      sessionStorage.set(ACCESS_TOKEN, access_token);
      sessionStorage.set(REFRESH_TOKEN, refresh_token);
      return;
    }
    sessionStorage.clear();
    await Promise.all([
      storage.set(ACCESS_TOKEN, access_token),
      storage.set(REFRESH_TOKEN, refresh_token)
    ]);
  },
  clear: () => {
    sessionStorage.clear();
    return Promise.all([storage.remove(ACCESS_TOKEN), storage.remove(REFRESH_TOKEN)]);
  }
};
