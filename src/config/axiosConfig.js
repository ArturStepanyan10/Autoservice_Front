import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from './apiConfig';

const API__URL = `${API_URL}/api-base/token/refresh/`;

const logout = async () => {
  await AsyncStorage.removeItem('access');
  await AsyncStorage.removeItem('refresh');
  console.log('User logged out due to expired refresh token.');
};

// Флаг для предотвращения бесконечного цикла обновления токена
let isRefreshing = false;

const refreshAccessToken = async () => {
  if (isRefreshing) return null;
  isRefreshing = true;

  const refresh = await AsyncStorage.getItem('refresh');

  if (!refresh) {
    console.log('No refresh token found! Logging out...');
    await logout();
    isRefreshing = false;
    return null;
  }

  try {
    const response = await axios.post(API__URL, {refresh});

    const {access} = response.data;
    await AsyncStorage.setItem('access', access);
    console.log('Access token refreshed successfully!');

    isRefreshing = false;
    return access;
  } catch (error) {
    console.log(
      'Error refreshing access token:',
      error.response?.data || error.message,
    );

    // Если рефреш токен невалидный (401, 403), выходим из системы
    if (error.response?.status === 401 || error.response?.status === 403) {
      await logout();
    }

    isRefreshing = false;
    return null;
  }
};

// Перехватчик запросов: добавляем токен в заголовки
axios.interceptors.request.use(
  async config => {
    const access = await AsyncStorage.getItem('access');

    if (access) {
      config.headers.Authorization = `JWT ${access}`;
    }

    return config;
  },
  error => Promise.reject(error),
);

// Перехватчик ответов: обрабатываем 401 ошибки
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // Если запрос уже пытался обновить токен - не повторяем его снова
    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      console.log('Access token expired, refreshing...');

      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        originalRequest._retry = true;
        originalRequest.headers.Authorization = `JWT ${newAccessToken}`;
        return axios(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

export default axios;
