import api from './api.js';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  googleAuth: (data) => api.post('/auth/google', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const urlService = {
  createUrl: (data) => api.post('/urls', data),
  getUserUrls: (params) => api.get('/urls/list', { params }),
  getUrlDetails: (id) => api.get(`/urls/${id}`),
  updateUrl: (id, data) => api.put(`/urls/${id}`, data),
  deleteUrl: (id) => api.delete(`/urls/${id}`),
  getUrlAnalytics: (id) => api.get(`/urls/analytics/${id}`),
  getDashboardAnalytics: () => api.get('/urls/analytics/dashboard'),
};

export const redirectService = {
  redirectUrl: (identifier, password = null) =>
    api.post(`/redirect/${identifier}`, { password }),
};

export const adminService = {
  getAllUsers: () => api.get('/admin/users'),
  disableUser: (id) => api.put(`/admin/users/${id}/disable`),
  enableUser: (id) => api.put(`/admin/users/${id}/enable`),
  disableLink: (id) => api.put(`/admin/links/${id}/disable`),
  getAdminStats: () => api.get('/admin/stats'),
};
