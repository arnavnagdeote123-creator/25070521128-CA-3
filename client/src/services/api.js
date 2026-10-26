const API_BASE = '/api';

export const getToken = () => localStorage.getItem('cinescope_token');

export const setAuthData = (token, user) => {
  localStorage.setItem('cinescope_token', token);
  localStorage.setItem('cinescope_user', JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem('cinescope_token');
  localStorage.removeItem('cinescope_user');
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('cinescope_user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

// Auth API Calls
export const authAPI = {
  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),
  getProfile: () => request('/auth/me')
};

// Movies CRUD API Calls
export const moviesAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.genre && params.genre !== 'All') query.append('genre', params.genre);
    if (params.status && params.status !== 'All') query.append('status', params.status);
    if (params.platform && params.platform !== 'All') query.append('platform', params.platform);
    if (params.sort) query.append('sort', params.sort);
    const qs = query.toString();
    return request(`/movies${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => request(`/movies/${id}`),
  create: (movieData) =>
    request('/movies', {
      method: 'POST',
      body: JSON.stringify(movieData)
    }),
  update: (id, movieData) =>
    request(`/movies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(movieData)
    }),
  delete: (id) =>
    request(`/movies/${id}`, {
      method: 'DELETE'
    }),
  seed: () =>
    request('/movies/seed', {
      method: 'POST'
    })
};
