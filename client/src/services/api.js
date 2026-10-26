const API_BASE = '/api';

// Helper to get stored auth token
export const getToken = () => localStorage.getItem('ca03_token');

export const setAuthData = (token, user) => {
  localStorage.setItem('ca03_token', token);
  localStorage.setItem('ca03_user', JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem('ca03_token');
  localStorage.removeItem('ca03_user');
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('ca03_user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// Generic fetch wrapper with Authorization header
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

// Songs CRUD API Calls
export const songsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.genre && params.genre !== 'All') query.append('genre', params.genre);
    if (params.sort) query.append('sort', params.sort);
    const qs = query.toString();
    return request(`/songs${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => request(`/songs/${id}`),
  create: (songData) =>
    request('/songs', {
      method: 'POST',
      body: JSON.stringify(songData)
    }),
  update: (id, songData) =>
    request(`/songs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(songData)
    }),
  delete: (id) =>
    request(`/songs/${id}`, {
      method: 'DELETE'
    }),
  seed: () =>
    request('/songs/seed', {
      method: 'POST'
    })
};
