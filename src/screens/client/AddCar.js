import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import * as Yup from 'yup';
import {Formik} from 'formik';
import axios from '../../config/axiosConfig';

function AddCar() {
  const [photo, setPhoto] = useState(null);
  const navigation = useNavigation();

  const validationSchema = Yup.object().shape({
    brand: Yup.string().required('Марка автомобиля обязательна'),
    model: Yup.string().required('Модель автомобиля обязательна'),
    vin: Yup.string()
      .required('VIN обязателен')
      .matches(
        /^[A-HJ-NPR-Z0-9]{17}$/,
        'VIN должен состоять из 17 символов (без I, O, Q)',
      ),
    licensePlate: Yup.string()
      .required('Госномер обязателен')
      .matches(
        /^[АВЕКМНОРСТУХ]{1}\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/,
        'Госномер должен быть в формате С001КЕ33',
      ),
  });

  const handleImagePick = async () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
      },
      response => {
        if (response.didCancel) {
          console.log('Выбор фото отменен');
        } else if (response.errorMessage) {
          console.log('Ошибка при выборе изображения:', response.errorMessage);
        } else {
          const selectedPhoto = response.assets[0];
          setPhoto(selectedPhoto);
        }
      },
    );
  };

  const handleSubmit = async values => {
    const carData = new FormData();
    carData.append('brand', values.brand);
    carData.append('model', values.model);
    carData.append('year', parseInt(values.year, 10));
    carData.append('color', values.color);
    carData.append('vin', values.vin);
    carData.append('license_plate', values.licensePlate);

    if (photo) {
      carData.append('photo', {
        uri: photo.uri,
        type: photo.type,
        name: photo.fileName || 'photo.jpg',
      });
    }

    try {
      const response = await axios.post(
        'http://192.168.8.116:8000/api/carslist/',
        carData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.status === 201) {
        Alert.alert('Успех', 'Машина успешно добавлена!');
        navigation.popToTop();
      }
    } catch (error) {
      console.log('Ошибка при добавлении машины:', error);
      Alert.alert(
        'Ошибка',
        'Не удалось добавить машину. Проверьте данные и повторите попытку.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Добавление автомобиля</Text>

      <Formik
        initialValues={{
          brand: '',
          model: '',
          year: '',
          color: '',
          vin: '',
          licensePlate: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          touched,
          errors,
        }) => (
          <>
            <TextInput
              style={[
                styles.input,
                touched.brand && errors.brand ? styles.errorInput : null,
              ]}
              placeholder="Марка (например, BMW) *"
              value={values.brand}
              onChangeText={handleChange('brand')}
              onBlur={handleBlur('brand')}
              placeholderTextColor="#ccc"
            />
            {touched.brand && errors.brand && (
              <Text style={styles.errorText}>{errors.brand}</Text>
            )}

            <TextInput
              style={[
                styles.input,
                touched.model && errors.model ? styles.errorInput : null,
              ]}
              placeholder="Модель (например, M5 F90) *"
              value={values.model}
              onChangeText={handleChange('model')}
              onBlur={handleBlur('model')}
              placeholderTextColor="#ccc"
            />
            {touched.model && errors.model && (
              <Text style={styles.errorText}>{errors.model}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Год выпуска (например, 2020) (не обязательно)"
              value={values.year}
              onChangeText={handleChange('year')}
              onBlur={handleBlur('year')}
              placeholderTextColor="#ccc"
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Цвет (например, черный) (не обязательно)"
              value={values.color}
              onChangeText={handleChange('color')}
              onBlur={handleBlur('color')}
              placeholderTextColor="#ccc"
            />

            <TextInput
              style={[
                styles.input,
                touched.vin && errors.vin ? styles.errorInput : null,
              ]}
              placeholder="VIN (например, XTAFTA211440A1234567) *"
              value={values.vin}
              onChangeText={handleChange('vin')}
              onBlur={handleBlur('vin')}
              placeholderTextColor="#ccc"
            />
            {touched.vin && errors.vin && (
              <Text style={styles.errorText}>{errors.vin}</Text>
            )}

            <TextInput
              style={[
                styles.input,
                touched.licensePlate && errors.licensePlate
                  ? styles.errorInput
                  : null,
              ]}
              placeholder="Гос. номер (например, А005АА33) *"
              value={values.licensePlate}
              onChangeText={handleChange('licensePlate')}
              onBlur={handleBlur('licensePlate')}
              placeholderTextColor="#ccc"
            />
            {touched.licensePlate && errors.licensePlate && (
              <Text style={styles.errorText}>{errors.licensePlate}</Text>
            )}

            <TouchableOpacity
              style={styles.imagePickerButton}
              onPress={handleImagePick}>
              <Text style={styles.imagePickerText}>
                Выбрать фото (не обязательно)
              </Text>
            </TouchableOpacity>

            {photo && (
              <Image source={{uri: photo.uri}} style={styles.imagePreview} />
            )}

            <TouchableOpacity onPress={handleSubmit}>
              <Text style={styles.addCar}>Добавить автомобиль</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.back}>Назад</Text>
            </TouchableOpacity>
          </>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    padding: 20,
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
  errorInput: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  addCar: {
    width: '90%',
    textAlign: 'center',
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    color: '#fff',
    marginTop: 20,
    fontSize: 18,
  },
  imagePickerButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  imagePickerText: {
    color: '#fff',
    textAlign: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
  back: {
    color: '#007bff',
    fontSize: 17,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default AddCar;
