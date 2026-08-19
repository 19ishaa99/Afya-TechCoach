import { tokenStorage } from '../storage/tokenStorage';

const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL?.replace(/\/$/, '') ||'http://127.0.0.1:8000';
  console.log('API Base URL:', API_BASE_URL);
const DEFAULT_TIMEOUT = 15000;
let refreshPromise = null;

export class ApiError extends Error {
  constructor(message, status = 0, recoverable = false) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.recoverable = recoverable;
  }
}

export const isApiConfigured = () => Boolean(API_BASE_URL);

export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) throw new ApiError('Backend connection is not configured. Local demo mode remains available.', 0, true);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeout || DEFAULT_TIMEOUT);
  const token = options.auth === false ? null : await tokenStorage.getAccessToken();
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: options.signal || controller.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
      }
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401 && options.auth !== false && options.retry !== false) {
        const refreshToken = await tokenStorage.getRefreshToken();
        if (refreshToken) {
          try {
            refreshPromise ||= apiRequest('/api/auth/refresh', {
              method: 'POST',
              body: JSON.stringify({ refresh_token: refreshToken }),
              auth: false,
              retry: false
            }).then(async tokens => {
              await tokenStorage.save(tokens, !tokenStorage.isSessionOnly());
              return tokens;
            }).finally(() => { refreshPromise = null; });
            await refreshPromise;
            return apiRequest(path, { ...options, retry: false });
          } catch (_) {
            await tokenStorage.clear();
          }
        } else {
          await tokenStorage.clear();
        }
      }
      throw new ApiError(body.detail || 'The server could not complete this request.', response.status, response.status >= 500 || response.status === 408);
    }
    return body;
  } catch (error) {
    if (error.name === 'AbortError') throw new ApiError('The request timed out. Check your connection and try again.', 408, true);
    if (error instanceof ApiError) throw error;
    throw new ApiError('Unable to reach Afya TechCoach. Check that the backend is running and your phone is online.', 0, true);
  } finally {
    clearTimeout(timeout);
  }
}
