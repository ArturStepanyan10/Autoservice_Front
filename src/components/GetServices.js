import { useEffect } from 'react';
import axios from './axiosConfig';

function GetServices({ setServices }) {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://192.168.8.116:8000/api/servicelist/');
                setServices(response.data);
            } catch (error) {
                console.log('Ошибка при загрузке услуг:', error);
            }
        };
        fetchData();
    }, [setServices]);

    return null;
}

export default GetServices;
