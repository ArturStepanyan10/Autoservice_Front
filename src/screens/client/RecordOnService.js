import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from '../../config/axiosConfig';
import ModalSelector from 'react-native-modal-selector';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '../../config/apiConfig';

function RecordOnService() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [cars, setCars] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const navigation = useNavigation();
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [recordsTime, setRecordsTime] = useState([]);

  const generateTimeSlots = (startTime, endTime, intervalMinutes) => {
    const slots = [];
    let currentTime = startTime;
    while (currentTime < endTime) {
      const hours = Math.floor(currentTime / 60);
      const minutes = currentTime % 60;
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;
      slots.push(formattedTime);
      currentTime += intervalMinutes;
    }
    return slots;
  };

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 14);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const carResponse = await axios.get(`${API_URL}/api-base/carslist/`);
        setCars(carResponse.data);

        const serviceResponse = await axios.get(
          `${API_URL}/api-base/servicelist/`,
        );
        setServices(serviceResponse.data);

        const times = generateTimeSlots(9 * 60, 19 * 60, 40);
        setAvailableTimes(times);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error.message);
        Alert.alert('Ошибка', 'Убедитесь в правильности данных!');
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!date || !selectedTime || !selectedService) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля.');
      return;
    }

    const [selectedHours, selectedMinutes] = selectedTime
      .split(':')
      .map(Number);
    if (
      selectedHours < 9 ||
      (selectedHours === 19 && selectedMinutes > 0) ||
      selectedHours > 19
    ) {
      Alert.alert('Ошибка', 'Автосервис работает с 9:00 до 19:00.');
      return;
    }

    try {
      const formattedTime = `${selectedTime}:00`;
      const response = await axios.post(
        `${API_URL}/api-base/appointmentlist/`,
        {
          date: date.toISOString().split('T')[0],
          time: formattedTime,
          car: selectedCar,
          service: selectedService,
        },
      );

      if (response.status === 201) {
        Alert.alert('Успех', 'Запись успешно добавлена!');
        navigation.popToTop();
      }

      setDate(new Date());
      setSelectedTime(null);
      setSelectedCar(null);
      setSelectedService(null);
    } catch (error) {
      const errorMessage =
        error.response?.data?.time?.[0] ||
        error.response?.data?.detail ||
        'Не удалось добавить запись. Пожалуйста, попробуйте снова.';
      Alert.alert('Ошибка', errorMessage);
      console.error(
        'Ошибка добавления записи:',
        error.response?.data || error.message,
      );
    }
  };

  useEffect(() => {
    const fetchTimes = async () => {
      if (!date) return;

      try {
        const formattedDate = date.toISOString().split('T')[0];
        const response = await axios.get(`${API_URL}/api-base/records/time/`, {
          params: {date: formattedDate},
        });

        const times = response.data.map(record => record.time);
        setRecordsTime(times || []);
      } catch (error) {
        console.log('Ошибка при загрузке занятых временных интервалов:', error);
      }
    };

    fetchTimes();
  }, [date]);

  const formattedAvailableTimes = availableTimes.map(time => {
    const [hours, minutes] = time.split(':').map(Number);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  });

  const formattedRecordsTime = recordsTime.map(time => {
    const [hours, minutes] = time.split(':').map(Number);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
  });

  const filteredTimes = formattedAvailableTimes.filter(
    time => !formattedRecordsTime.includes(time),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Записаться на услугу</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}>
        <Text style={styles.inputText}>Дата: {date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          minimumDate={new Date()}
          maximumDate={maxDate}
          onChange={handleDateChange}
        />
      )}

      <ModalSelector
        data={filteredTimes.map((time, index) => ({
          key: index,
          label: time,
          disabled: recordsTime.includes(time),
        }))}
        initValue={selectedTime || 'Выберите время'}
        onChange={option => setSelectedTime(option.label)}
        style={styles.input}>
        <Text style={styles.inputText}>{selectedTime || 'Выберите время'}</Text>
      </ModalSelector>

      <ModalSelector
        data={cars.map(car => ({
          key: car.id,
          label: `${car.brand} ${car.model} (${car.license_plate})`,
        }))}
        initValue={
          selectedCar
            ? `${cars.find(car => car.id === selectedCar).brand} ${
                cars.find(car => car.id === selectedCar).model
              } (${cars.find(car => car.id === selectedCar).license_plate})`
            : 'Выберите автомобиль (не обязательно)'
        }
        onChange={option => setSelectedCar(option.key)}
        style={styles.input}>
        <Text style={styles.inputText}>
          {selectedCar
            ? `${cars.find(car => car.id === selectedCar).brand} ${
                cars.find(car => car.id === selectedCar).model
              } (${cars.find(car => car.id === selectedCar).license_plate})`
            : 'Выберите автомобиль (не обязательно)'}
        </Text>
      </ModalSelector>

      <ModalSelector
        data={services.map(service => ({
          key: service.id,
          label: service.title,
        }))}
        initValue={
          selectedService
            ? services.find(service => service.id === selectedService)?.title
            : 'Выберите услугу'
        }
        onChange={option => setSelectedService(option.key)}
        style={styles.input}>
        <Text style={styles.inputText}>
          {selectedService
            ? services.find(service => service.id === selectedService)?.title
            : 'Выберите услугу'}
        </Text>
      </ModalSelector>

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Записаться на сервис</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>Назад</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    justifyContent: 'center',
    paddingLeft: 10,
    borderRadius: 8,
  },
  inputText: {
    fontSize: 16,
    color: '#555',
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  back: {
    color: '#007bff',
    fontSize: 17,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default RecordOnService;
