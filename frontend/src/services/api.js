import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for session cookies
});

// Get CSRF token from cookie
function getCsrfToken() {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Add CSRF token to requests
api.interceptors.request.use((config) => {
  const csrfToken = getCsrfToken();
  if (csrfToken && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
    config.headers['X-CSRFToken'] = csrfToken;
  }
  return config;
});

// API methods
export const authAPI = {
  login: (credentials) => api.post('/auth/login/', credentials),
  logout: () => api.post('/auth/logout/'),
  getUser: () => api.get('/auth/user/'),
  googleLogin: () => window.location.href = '/accounts/google/login/',
};

export const versesAPI = {
  list: () => api.get('/verses/'),
  get: (id) => api.get(`/verses/${id}/`),
  create: (data) => api.post('/verses/', data),
  update: (id, data) => api.patch(`/verses/${id}/`, data),
  delete: (id) => api.delete(`/verses/${id}/`),
};

export default api;
