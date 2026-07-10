import apiClient from './apiClient';

export const authAPI = {
  login: (email, password) => apiClient.post('/auth/login', { email, password }),
  logout: () => apiClient.post('/auth/logout'),
  refresh: () => apiClient.post('/auth/refresh')
};

export const userAPI = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.put('/users/profile', data),
  listUsers: () => apiClient.get('/users'),
  createUser: (data) => apiClient.post('/users', data)
};

export const productAPI = {
  getAll: () => apiClient.get('/products'),
  getByBarcode: (barcode) => apiClient.get(`/products/barcode/${barcode}`),
  create: (data) => apiClient.post('/products', data),
  update: (id, data) => apiClient.put(`/products/${id}`, data),
  delete: (id) => apiClient.delete(`/products/${id}`)
};

export const transactionAPI = {
  create: (data) => apiClient.post('/transactions', data),
  getAll: () => apiClient.get('/transactions'),
  getDetail: (id) => apiClient.get(`/transactions/${id}`),
  void: (id) => apiClient.post(`/transactions/${id}/void`)
};

export const reportAPI = {
  getSalesReport: (startDate, endDate) => apiClient.get(`/reports/sales?startDate=${startDate}&endDate=${endDate}`),
  getProfitLossReport: (startDate, endDate) => apiClient.get(`/reports/profit-loss?startDate=${startDate}&endDate=${endDate}`),
  getBalanceSheet: () => apiClient.get('/reports/balance-sheet'),
  getSHUReport: () => apiClient.get('/reports/shu')
};
