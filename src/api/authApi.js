import { apiRequest } from './client';
import { tokenStorage } from '../storage/tokenStorage';

export const authApi = {
  register: payload => apiRequest('/api/auth/register', { method: 'POST', body: JSON.stringify(payload), auth: false }),
  login: async (payload, persistent = true) => {
    const tokens = await apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify(payload), auth: false });
    await tokenStorage.save(tokens, persistent);
    return tokens;
  },
  me: () => apiRequest('/api/auth/me'),
  forgotPassword: email => apiRequest('/api/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
  logout: () => tokenStorage.clear()
};
