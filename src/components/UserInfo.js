import { useEffect } from 'react';
import axios from '../config/axiosConfig.js';

function UserInfo({ setUser }) {
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://192.168.8.116:8000/api-base/info/');
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
