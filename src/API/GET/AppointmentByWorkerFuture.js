import axios from '../../config/axiosConfig';
import {API_URL} from '../../config/apiConfig';
import {useEffect} from 'react';

function AppointmentByWorkerFuture({setAppointments}) {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api-base/appointment/by/worker-future/`,
        );
        console.log('Полученные записи:', response.data);
        setAppointments(response.data); // Обновляем состояние
      } catch (error) {
        console.log('Ошибка при получении записей:', error);
        throw error;
      }
    };
    fetchData();
  }, [setAppointments]);

  return null; // Функция ничего не рендерит, она только обновляет состояние
}

export default AppointmentByWorkerFuture;
