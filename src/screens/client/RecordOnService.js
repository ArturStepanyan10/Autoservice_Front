import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from '../../config/axiosConfig';
import ModalSelector from 'react-native-modal-selector';
import {useNavigation} from '@react-navigation/native';
import {API_URL} from '../../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

function RecordOnService() {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [cars, setCars] = useState([]);
  const [services, setServices] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [recordsTime, setRecordsTime] = useState([]);

  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('access');
      setIsAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isAuthenticated) {
          const carResponse = await axios.get(`${API_URL}/api-base/carslist/`);
          setCars(carResponse.data);
        }
        const serviceResponse = await axios.get(
          `${API_URL}/api-base/servicelist/`,
        );
        setServices(serviceResponse.data);

        const slots = [];
        for (let t = 9 * 60; t < 19 * 60; t += 60) {
          const h = Math.floor(t / 60);
          const m = t % 60;
          slots.push(
            `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`,
          );
        }
        setAvailableTimes(slots);
      } catch (error) {
        console.log('Ошибка загрузки данных:', error.message);
        Alert.alert('Ошибка', 'Не удалось загрузить данные!');
      }
    };
    fetchData();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchTimes = async () => {
      if (!date) return;
      try {
        const formattedDate = date.toISOString().split('T')[0];
        const response = await axios.get(`${API_URL}/api-base/records/time/`, {
          params: {date: formattedDate},
        });
        const times = response.data.map(r =>
          r.time.split(':').slice(0, 2).join(':'),
        );
        setRecordsTime(times);
      } catch (error) {
        console.log('Ошибка при загрузке занятых временных интервалов:', error);
      }
    };
    fetchTimes();
  }, [date]);

  const handleDateChange = (event, d) => {
    setShowDatePicker(false);
    if (d) setDate(d);
  };

  const handleSubmit = async () => {
    if (
      (!isAuthenticated && (!firstName || !lastName || !email)) ||
      !selectedService ||
      !selectedTime
    ) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все обязательные поля.');
      return;
    }

    const payload = {
      date: date.toISOString().split('T')[0],
      time: `${selectedTime}:00`,
      service: [selectedService],
      phone_number: phone,
      description,
    };
    if (isAuthenticated) {
      payload.car = selectedCar;
    } else {
      payload.first_name = firstName;
      payload.last_name = lastName;
      payload.email = email;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api-base/appointmentlist/`,
        payload,
      );
      if (response.status === 201) {
        Alert.alert('Успех', 'Запись успешно добавлена!');
        navigation.popToTop();
      }
    } catch (error) {
      console.log(
        'Ошибка добавления записи:',
        error.response?.data || error.message,
      );
      const msg = error.response?.data?.detail || 'Не удалось добавить запись.';
      Alert.alert('Ошибка', msg);
    }
  };

  const times = availableTimes.filter(t => !recordsTime.includes(t));

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          maximumDate={new Date(new Date().setDate(new Date().getDate() + 14))}
          onChange={handleDateChange}
        />
      )}

      <ModalSelector
        data={times.map((time, i) => ({key: i, label: time}))}
        initValue={selectedTime || 'Выберите время'}
        onChange={opt => setSelectedTime(opt.label)}
        style={styles.input}>
        <Text style={styles.inputText}>{selectedTime || 'Выберите время'}</Text>
      </ModalSelector>

      {isAuthenticated ? (
        <ModalSelector
          data={cars.map(c => ({key: c.id, label: `${c.brand} ${c.model}`}))}
          initValue={
            selectedCar
              ? cars.find(c => c.id === selectedCar).brand +
                ' ' +
                cars.find(c => c.id === selectedCar).model
              : 'Выберите автомобиль'
          }
          onChange={opt => setSelectedCar(opt.key)}
          style={styles.input}>
          <Text style={styles.inputText}>
            {selectedCar
              ? cars.find(c => c.id === selectedCar).brand +
                ' ' +
                cars.find(c => c.id === selectedCar).model
              : 'Выберите автомобиль'}
          </Text>
        </ModalSelector>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Имя"
            value={firstName}
            onChangeText={setFirstName}
            placeholderTextColor="#ccc"
          />
          <TextInput
            style={styles.input}
            placeholder="Фамилия"
            value={lastName}
            onChangeText={setLastName}
            placeholderTextColor="#ccc"
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#ccc"
          />
        </>
      )}

      <TextInput
        style={styles.input}
        placeholder="Телефон"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
        placeholderTextColor="#ccc"
      />

      <ModalSelector
        data={services.map(s => ({key: s.id, label: s.title}))}
        initValue={
          selectedService
            ? services.find(s => s.id === selectedService).title
            : 'Выберите услугу'
        }
        onChange={opt => setSelectedService(opt.key)}
        style={styles.input}>
        <Text style={styles.inputText}>
          {selectedService
            ? services.find(s => s.id === selectedService).title
            : 'Выберите услугу'}
        </Text>
      </ModalSelector>
      <TextInput
        style={styles.input}
        placeholder="Описание проблемы"
        value={description}
        onChangeText={setDescription}
        placeholderTextColor="#ccc"
      />

      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Записаться</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>Назад</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
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
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  back: {
    color: '#007bff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
    textDecorationLine: 'underline',
  },
});

export default RecordOnService;
