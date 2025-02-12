import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.8.116:8000/api/token/refresh/';

const logout = async () => {
  await AsyncStorage.removeItem('access');
  await AsyncStorage.removeItem('refresh');
  console.log('User logged out due to expired refresh token.');
};


const refreshAccessToken = async () => {
  const refresh = await AsyncStorage.getItem('refresh');

  if (!refresh) {
    console.error('No refresh token found! Logging out...');
    await logout();
    return null;
  }

  try {
    const response = await axios.post(API_URL, { refresh });

    const { access } = response.data;
    await AsyncStorage.setItem('access', access);
    console.log('Access token refreshed successfully!');
    return access;
  } catch (error) {
    console.log('Error refreshing access token:', error.response?.data || error.message);

    // Если рефреш токен невалидный (401, 403), выходим из системы
    if (error.response?.status === 401 || error.response?.status === 403) {
      await logout();
    }

    return null;
  }
};


axios.interceptors.request.use(async (config) => {
  const access = await AsyncStorage.getItem('access');

  if (access) {
    config.headers.Authorization = `JWT ${access}`;
  }

  return config;
}, (error) => Promise.reject(error));


axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log('Access token expired, refreshing...');

      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        error.config.headers.Authorization = `JWT ${newAccessToken}`;
        return axios(error.config); // Повторяем запрос с новым токеном
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
