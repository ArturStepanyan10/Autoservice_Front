import {useEffect} from 'react';
import axios from '../../config/axiosConfig';
import {API_URL} from '../../config/apiConfig';

function GetServices({setServices}) {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api-base/servicelist/`);
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
