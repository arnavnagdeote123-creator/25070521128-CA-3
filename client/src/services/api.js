const API_BASE = '/api';

export const getToken = () => localStorage.getItem('finwise_token');

export const setAuthData = (token, user) => {
  localStorage.setItem('finwise_token', token);
  localStorage.setItem('finwise_user', JSON.stringify(user));
};

export const clearAuthData = () => {
  localStorage.removeItem('finwise_token');
  localStorage.removeItem('finwise_user');
};

export const getStoredUser = () => {
  try {
    const user = localStorage.getItem('finwise_user');
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

// Transactions CRUD API Calls
export const transactionsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams();
    if (params.type && params.type !== 'All') query.append('type', params.type);
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.paymentMethod && params.paymentMethod !== 'All') query.append('paymentMethod', params.paymentMethod);
    if (params.search) query.append('search', params.search);
    if (params.sort) query.append('sort', params.sort);
    const qs = query.toString();
    return request(`/transactions${qs ? `?${qs}` : ''}`);
  },
  getById: (id) => request(`/transactions/${id}`),
  create: (txnData) =>
    request('/transactions', {
      method: 'POST',
      body: JSON.stringify(txnData)
    }),
  update: (id, txnData) =>
    request(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(txnData)
    }),
  delete: (id) =>
    request(`/transactions/${id}`, {
      method: 'DELETE'
    }),
  seed: () =>
    request('/transactions/seed', {
      method: 'POST'
    })
};
