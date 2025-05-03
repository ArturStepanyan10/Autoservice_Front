import {useEffect} from 'react';
import axios from '../../config/axiosConfig.js';
import {API_URL} from '../../config/apiConfig.js';

function UserInfo({setUser}) {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/api-base/info/`);
        setUser(response.data);
      } catch (error) {
        console.log('Ошибка при загрузке данных пользователя:', error);
      }
    };

    fetchUser();
  }, [setUser]);

  return null;
}

export default UserInfo;
