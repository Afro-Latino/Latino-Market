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
  
  update: async (id, data) => {
    const response = await api.put(`/categories/${id}`, data);
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
  
  update: async (id, data) => {
    const response = await api.put(`/recipes/${id}`, data);
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
  
  createAdmin: async (data) => {
    const response = await api.post('/orders/admin/create', data);
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
  
  // Admin endpoints
  getAllAdmin: async (params = {}) => {
    const response = await api.get('/admin/orders', { params });
    return response.data;
  },
  
  updateStatus: async (id, data) => {
    const response = await api.put(`/admin/orders/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/admin/orders/${id}`);
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
  
  paypalCheckout: async (orderId) => {
    const response = await api.get(`/payments/paypal/checkout/${orderId}`);
    return response.data;
  },
  
  paypalCapture: async (orderId, paypalOrderId) => {
    const response = await api.post(`/payments/paypal/capture/${orderId}`, null, {
      params: { paypal_order_id: paypalOrderId }
    });
    return response.data;
  },
};

// Upload API (Cloudinary)
export const uploadAPI = {
  uploadImage: async (file, folder = 'products') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);
    
    const response = await api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  
  deleteImage: async (publicId) => {
    const response = await api.delete(`/upload/image/${publicId}`);
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
  
  getById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },
  
  block: async (id, data) => {
    const response = await api.put(`/admin/users/${id}/block`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
  },
  
  createCustomer: async (data) => {
    const response = await api.post('/admin/customers', data);
    return response.data;
  },
};

// Admin Notifications API
export const adminNotificationsAPI = {
  getAll: async (unreadOnly = false) => {
    const response = await api.get('/admin/notifications', { params: { unread_only: unreadOnly } });
    return response.data;
  },
  
  markRead: async (id) => {
    const response = await api.put(`/admin/notifications/${id}/read`);
    return response.data;
  },
  
  markAllRead: async () => {
    const response = await api.put('/admin/notifications/read-all');
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/admin/notifications/${id}`);
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
  
  getPaymentStatus: async () => {
    const response = await api.get('/settings/payment-status');
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

// FAQs API
export const faqsAPI = {
  getAll: async () => {
    const response = await api.get('/faqs');
    return response.data;
  },
  
  getAllAdmin: async () => {
    const response = await api.get('/faqs/all');
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/faqs', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/faqs/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/faqs/${id}`);
    return response.data;
  },
};

// Deals API
export const dealsAPI = {
  getAll: async () => {
    const response = await api.get('/deals');
    return response.data;
  },
  
  getAllAdmin: async () => {
    const response = await api.get('/deals/all');
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/deals', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/deals/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/deals/${id}`);
    return response.data;
  },
};

// Reviews API
export const reviewsAPI = {
  getAll: async (productId = null) => {
    const params = productId ? { product_id: productId } : {};
    const response = await api.get('/reviews', { params });
    return response.data;
  },
  
  getAllAdmin: async () => {
    const response = await api.get('/reviews/all');
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/reviews', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/reviews/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

// Shipping API
export const shippingAPI = {
  getAll: async () => {
    const response = await api.get('/shipping');
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/shipping', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/shipping/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/shipping/${id}`);
    return response.data;
  },
};

// Newsletter API
export const newsletterAPI = {
  getSubscribers: async () => {
    const response = await api.get('/newsletter/subscribers');
    return response.data;
  },
  
  subscribe: async (data) => {
    const response = await api.post('/newsletter/subscribe', data);
    return response.data;
  },
  
  unsubscribe: async (id) => {
    const response = await api.delete(`/newsletter/${id}`);
    return response.data;
  },
};

// Admin Management API
export const adminsAPI = {
  getAll: async () => {
    const response = await api.get('/admin/admins');
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/admin/admins', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/admin/admins/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/admin/admins/${id}`);
    return response.data;
  },
};

// Themes API
export const themesAPI = {
  getAll: async () => {
    const response = await api.get('/themes');
    return response.data;
  },
  
  getActive: async () => {
    const response = await api.get('/themes/active');
    return response.data;
  },
  
  activate: async (id) => {
    const response = await api.put(`/themes/${id}/activate`);
    return response.data;
  },
};

// Franchise API
export const franchiseAPI = {
  getAll: async () => {
    const response = await api.get('/franchises');
    return response.data;
  },
  
  create: async (data) => {
    const response = await api.post('/franchises', data);
    return response.data;
  },
  
  update: async (id, data) => {
    const response = await api.put(`/franchises/${id}`, data);
    return response.data;
  },
  
  delete: async (id) => {
    const response = await api.delete(`/franchises/${id}`);
    return response.data;
  },
};

// Bulk Import API
export const bulkImportAPI = {
  getTemplate: async () => {
    const response = await api.get('/products/template');
    return response.data;
  },
  
  importProducts: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/products/bulk-import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
};

// Auto Blog Generation API
export const autoBlogAPI = {
  generate: async (data) => {
    const response = await api.post('/blog/generate', data);
    return response.data;
  },
  
  generateAI: async (data) => {
    const response = await api.post('/blog/generate-ai', data);
    return response.data;
  },
};

// Blog Automation Settings API
export const blogAutomationAPI = {
  getSettings: async () => {
    const response = await api.get('/settings/blog-automation');
    return response.data;
  },
  
  updateSettings: async (data) => {
    const response = await api.put('/settings/blog-automation', data);
    return response.data;
  },
};

// Branding Settings API
export const brandingAPI = {
  get: async () => {
    const response = await api.get('/settings/branding');
    return response.data;
  },
  
  update: async (data) => {
    const response = await api.put('/settings/branding', data);
    return response.data;
  },
};

// Email API
export const emailAPI = {
  getStatus: async () => {
    const response = await api.get('/email/status');
    return response.data;
  },
  
  sendTest: async (data) => {
    const response = await api.post('/email/test', data);
    return response.data;
  },
};

// Customer Export API
export const customersAPI = {
  export: async (format = 'csv') => {
    const response = await api.get(`/customers/export?format=${format}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/customers/stats');
    return response.data;
  },
};

export default api;
