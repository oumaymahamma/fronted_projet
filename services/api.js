import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.1.17:8000/api/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Erreur lors de la récupération du token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/register/', userData),
  login: (credentials) => api.post('/login/', credentials),
  getProfile: () => api.get('/profile/'),
  updateProfile: (profileData) => api.put('/profile/', profileData),
  // NOUVEAUX ENDPOINTS
  updatePersonalInfo: (personalData) => api.put('/profile/personal-info/', personalData),
  changePassword: (passwordData) => api.post('/change-password/', passwordData),
};

export default api;