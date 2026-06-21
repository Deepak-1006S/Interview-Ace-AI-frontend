import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',  // Vite proxy handles this in dev
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-refresh token on 401
// Response handling: unwrap backend wrapper and map tokens for compatibility
api.interceptors.response.use(
  (res) => {
    // Backend responses use { success, message, data }
    const payload = res?.data?.data ?? res?.data;
    if (payload && payload.accessToken) {
      // Provide a legacy `token` field for existing callers
      payload.token = payload.accessToken;
      // Persist tokens automatically on auth responses
      try {
        localStorage.setItem('accessToken', payload.accessToken);
        if (payload.refreshToken) localStorage.setItem('refreshToken', payload.refreshToken);
      } catch {}
    }
    // Preserve axios response shape but unwrap backend wrapper into res.data
    res.data = payload;
    return res;
  },
  async (err) => {
    if (err.response?.status === 401 && !err.config._retry) {
      err.config._retry = true;
      const refresh = localStorage.getItem('refreshToken');
      const { data } = await axios.post('/api/v1/auth/refresh', { refreshToken: refresh });
      // `data` here is the raw axios response; follow backend wrapper
      const refreshed = data?.data ?? data;
      localStorage.setItem('accessToken', refreshed.accessToken);
      if (refreshed.refreshToken) localStorage.setItem('refreshToken', refreshed.refreshToken);
      err.config.headers = err.config.headers || {};
      err.config.headers.Authorization = `Bearer ${refreshed.accessToken}`;
      return api(err.config);
    }
    return Promise.reject(err);
  }
);

export default api;
