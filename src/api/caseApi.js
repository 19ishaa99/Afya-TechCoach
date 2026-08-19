import { apiRequest } from './client';
export const caseApi = {
  list: () => apiRequest('/api/cases'),
  detail: id => apiRequest(`/api/cases/${id}`),
  specialties: () => apiRequest('/api/cases/specialties'),
  askHistory: (id, question) => apiRequest(`/api/cases/${id}/history-question`, { method: 'POST', body: JSON.stringify({ question }) }),
  requestExamination: (id, request) => apiRequest(`/api/cases/${id}/examination`, { method: 'POST', body: JSON.stringify({ request }) }),
  requestInvestigation: (id, request) => apiRequest(`/api/cases/${id}/investigation`, { method: 'POST', body: JSON.stringify({ request }) })
};
