import { apiRequest } from './client';
export const progressApi = {
  dashboard: () => apiRequest('/api/progress/dashboard'),
  specialties: () => apiRequest('/api/progress/specialties'),
  history: () => apiRequest('/api/progress/history')
};
