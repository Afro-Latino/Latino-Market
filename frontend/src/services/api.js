import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: async (data) => {
    const response = await api.post('/auth/register', data);
    if (response.data.session_token) {
      localStorage.setItem('auth_token', response.data.session_token);
    }
    return response.data;
  },
  
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    if (response.data.session_token) {
      localStorage.setItem('auth_token', response.data.session_token);
    }
    return response.data;
  },
  
  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('auth_token');
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Products API
export const productsAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/products', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/categories', data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

// Regions API
export const regionsAPI = {
  getAll: async () => {
    const response = await api.get('/regions');
    return response.data;
  },
};

// Recipes API
export const recipesAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/recipes', { params });
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/recipes', data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/recipes/${id}`);
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  create: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
};

// Payments API
export const paymentsAPI = {
  stripeCheckout: async (orderId) => {
    const response = await api.get(`/payments/stripe/checkout/${orderId}`);
    return response.data;
  },
  
  stripeStatus: async (sessionId) => {
    const response = await api.get(`/payments/stripe/status/${sessionId}`);
    return response.data;
  },
};

// Testimonials API
export const testimonialsAPI = {
  getAll: async () => {
    const response = await api.get('/testimonials');
    return response.data;
  },
};

// Users API
export const usersAPI = {
  getAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
};

// Settings API
export const settingsAPI = {
  get: async () => {
    const response = await api.get('/settings');
    return response.data;
  },
  
  update: async (data) => {
    const response = await api.put('/settings', data);
    return response.data;
  },
};

// Holiday Notices API
export const noticesAPI = {
  getActive: async () => {
    const response = await api.get('/notices');
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/notices/all');
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/notices', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/notices/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/notices/${id}`);
    return response.data;
  },
};

// Blog API
export const blogAPI = {
  getAll: async (params = {}) => {
    const response = await api.get('/blog', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/blog/${id}`);
    return response.data;
  },
  
  getBySlug: async (slug) => {
    const response = await api.get(`/blog/slug/${slug}`);
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/blog', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/blog/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/blog/${id}`);
    return response.data;
  },
};

// Announcements API
export const announcementsAPI = {
  getActive: async () => {
    const response = await api.get('/announcements');
    return response.data;
  },
  
  getAll: async () => {
    const response = await api.get('/announcements/all');
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/announcements', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/announcements/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  },
};

export default api;
