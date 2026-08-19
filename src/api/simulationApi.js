import { apiRequest } from './client';
export const simulationApi = {
  start: caseId => apiRequest('/api/simulations/start', { method: 'POST', body: JSON.stringify({ case_id: caseId }) }),
  get: id => apiRequest(`/api/simulations/${id}`),
  save: (id, response) => apiRequest(`/api/simulations/${id}`, { method: 'PATCH', body: JSON.stringify(response) }),
  submit: id => apiRequest(`/api/simulations/${id}/submit`, { method: 'POST' }),
  evaluate: id => apiRequest(`/api/simulations/${id}/evaluate`, { method: 'POST', timeout: 60000 }),
  feedback: id => apiRequest(`/api/simulations/${id}/feedback`),
  history: () => apiRequest('/api/simulations/history'),
  retry: id => apiRequest(`/api/simulations/${id}/retry`, { method: 'POST' })
};
