import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from 'react-native';
import axios from '../../config/axiosConfig';
import {useRoute, useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';

function EditCar() {
  const route = useRoute();
  const navigation = useNavigation();
  const {carId} = route.params;

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [color, setColor] = useState('');
  const [vin, setVin] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [photo, setPhoto] = useState(null);

  const validateLicensePlate = value =>
    /^[АВЕКМНОРСТУХ]{1}\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/.test(value);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        const response = await axios.get(
          `http://192.168.8.116:8000/api/carslist/${carId}/`,
        );
        const car = response.data;

        setBrand(car.brand);
        setModel(car.model);
        setYear(car.year.toString());
        setColor(car.color);
        setVin(car.vin);
        setLicensePlate(car.license_plate);
        setPhoto(car.photo);
      } catch (error) {
        console.error('Ошибка при загрузке данных автомобиля:', error);
        Alert.alert('Ошибка', 'Не удалось загрузить данные автомобиля.');
      }
    };

    fetchCarData();
  }, [carId]);

  const handleSelectImage = () => {
    launchImageLibrary({noData: true}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorCode);
      } else {
        setPhoto(response.assets[0].uri);
      }
    });
  };

  const handleSaveChanges = async () => {
    if (!brand.trim() || !model.trim()) {
      Alert.alert('Ошибка', 'Поля "Марка" и "Модель" не могут быть пустыми.');
      return;
    }

    if (!validateLicensePlate(licensePlate)) {
      Alert.alert(
        'Ошибка',
        'Некорректный формат государственного номера. Пример: С001КЕ33.',
      );
      return;
    }

    try {
      const updatedCarData = new FormData();
      updatedCarData.append('brand', brand);
      updatedCarData.append('model', model);
      updatedCarData.append('year', year);
      updatedCarData.append('color', color);
      updatedCarData.append('vin', vin);
      updatedCarData.append('license_plate', licensePlate);

      if (photo) {
        const photoData = {
          uri: photo,
          type: 'image/jpeg',
          name: 'car_photo.jpg',
        };
        updatedCarData.append('photo', photoData);
      }

      const response = await axios.put(
        `http://192.168.8.116:8000/api/carslist/${carId}/`,
        updatedCarData,
        {headers: {'Content-Type': 'multipart/form-data'}},
      );

      if (response.status === 200) {
        Alert.alert('Успех', 'Данные автомобиля успешно обновлены.');
        navigation.popToTop();
      }
    } catch (error) {
      console.error(
        'Ошибка при обновлении автомобиля:',
        error.response?.data || error.message,
      );
      Alert.alert('Ошибка', 'Не удалось обновить данные автомобиля.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Редактирование автомобиля</Text>

      {photo ? (
        <Image source={{uri: photo}} style={styles.image} />
      ) : (
        <Text style={styles.noImage}>Фото не выбрано</Text>
      )}

      <TouchableOpacity
        style={styles.selectImageButton}
        onPress={handleSelectImage}>
        <Text style={styles.selectImageButtonText}>Выбрать фото</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Марка *"
        value={brand}
        onChangeText={setBrand}
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        placeholder="Модель *"
        value={model}
        onChangeText={setModel}
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        placeholder="Год выпуска"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        placeholder="Цвет"
        value={color}
        onChangeText={setColor}
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={[styles.input, styles.readOnly]}
        placeholder="VIN"
        value={vin}
        editable={false}
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        placeholder="Гос. номер *"
        value={licensePlate}
        onChangeText={setLicensePlate}
        placeholderTextColor="#ccc"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.saveButtonText}>Сохранить изменения</Text>
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  readOnly: {
    backgroundColor: '#e9ecef',
    color: '#6c757d',
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'center',
  },
  noImage: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
  },
  selectImageButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  selectImageButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  back: {
    color: '#007bff',
    fontSize: 17,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default EditCar;
