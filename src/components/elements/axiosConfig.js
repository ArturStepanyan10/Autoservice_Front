import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const refreshAccessToken = async () => {
  const refresh = await AsyncStorage.getItem('refresh');

  if (!refresh) {
    console.error('No refresh token found!');
    return;
  }

  try {
    const response = await axios.post('http://192.168.8.116:8000/api/token/refresh/', {
      refresh: refresh,
    });

    const { access } = response.data;
    await AsyncStorage.setItem('access', access);
    console.log('Access token refreshed successfully!');
  } catch (error) {
    console.error('Error refreshing access token:', error);
    throw error;
  }
};


axios.interceptors.request.use(async (config) => {
  const access = await AsyncStorage.getItem('access');

  if (access) {
    config.headers.Authorization = `JWT ${access}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log('Access token expired, refreshing...');
      try {
        await refreshAccessToken();

        // Повторный запрос с обновлённым токеном
        const access = await AsyncStorage.getItem('access');
        if (access) {
          error.config.headers.Authorization = `JWT ${access}`;
          return axios(error.config);
        }
      } catch (refreshError) {
        console.error('Error during token refresh:', refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
