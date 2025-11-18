import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// UTILISEZ VOTRE IP TROUVÉE
const API_URL = 'http://192.168.1.17:8000/api';

console.log('🔄 API URL utilisée:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

api.interceptors.request.use(async (config) => {
  console.log(`➡️ Requête API: ${config.method?.toUpperCase()} ${config.url}`);
  try {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.log('Erreur récupération token:', error);
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log(`✅ Réponse API ${response.status}: ${response.config.url}`);
    return response;
  },
  (error) => {
    console.log('❌ Erreur API:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      url: error.config?.url
    });
    return Promise.reject(error);
  }
);

export default api;