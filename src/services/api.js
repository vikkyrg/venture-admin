import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const loginAdmin = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const getAdminProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Course API
export const getCourses = async () => {
  const response = await api.get('/courses');
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/stats/dashboard');
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await api.post('/courses', courseData);
  return response.data;
};

export const updateCourse = async (id, courseData) => {
  const response = await api.put(`/courses/${id}`, courseData);
  return response.data;
};

export const deleteCourse = async (id) => {
  const response = await api.delete(`/courses/${id}`);
  return response.data;
};

// Module API
export const getModulesByCourse = async (courseId) => {
  const response = await api.get(`/modules/course/${courseId}`);
  return response.data;
};

export const createModule = async (moduleData) => {
  const response = await api.post('/modules', moduleData);
  return response.data;
};

export const updateModule = async (id, moduleData) => {
  const response = await api.put(`/modules/${id}`, moduleData);
  return response.data;
};

export const deleteModule = async (id) => {
  const response = await api.delete(`/modules/${id}`);
  return response.data;
};

// Topic API
export const getTopicsByModule = async (moduleId) => {
  const response = await api.get(`/topics/module/${moduleId}`);
  return response.data;
};

export const createTopic = async (topicData) => {
  const response = await api.post('/topics', topicData);
  return response.data;
};

export const updateTopic = async (id, topicData) => {
  const response = await api.put(`/topics/${id}`, topicData);
  return response.data;
};

export const deleteTopic = async (id) => {
  const response = await api.delete(`/topics/${id}`);
  return response.data;
};

// Enquiry API
export const getEnquiries = async (params = {}) => {
  const response = await api.get('/enquiries', { params });
  return response.data;
};

export const updateEnquiryStatus = async (id, status) => {
  const response = await api.put(`/enquiries/${id}`, { status });
  return response.data;
};

export const deleteEnquiry = async (id) => {
  const response = await api.delete(`/enquiries/${id}`);
  return response.data;
};

// Media API
export const getMediaFiles = async () => {
  const response = await api.get('/media');
  return response.data;
};

export const uploadMediaFile = async (formData) => {
  const response = await api.post('/media', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const deleteMediaFile = async (id) => {
  const response = await api.delete(`/media/${id}`);
  return response.data;
};

// Settings API
export const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

export const updateSettings = async (settingsData) => {
  const response = await api.put('/settings', settingsData);
  return response.data;
};

export default api;
