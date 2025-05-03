import axios from '../../config/axiosConfig';
import {API_URL} from '../../config/apiConfig';
import {useEffect} from 'react';

function AppointmentByWorkerPast(setAppointments) {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api-base/appointment/by/worker-past/`,
        );
        return response.data;
      } catch (error) {
        console.log('Ошибка при получении записей:', error);
        throw error;
      }
    };
    fetchData();
  }, [setAppointments]);
}

export default AppointmentByWorkerPast;
