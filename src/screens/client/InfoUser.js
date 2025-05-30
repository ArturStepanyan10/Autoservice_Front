import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from '../../config/axiosConfig';
import {API_URL} from '../../config/apiConfig';

function InfoUser({route, navigation}) {
  const {userData} = route.params;
  const [firstName, setFirstName] = useState(userData.first_name);
  const [lastName, setLastName] = useState(userData.last_name);
  const [email, setEmail] = useState(userData.email);

  const handleSave = async () => {
    if (!firstName || !lastName || !email) {
      Alert.alert('Ошибка', 'Все поля обязательны для заполнения.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Ошибка', 'Введите корректный E-mail.');
      return;
    }

    try {
      const response = await axios.put(`${API_URL}/api-base/put/user/`, {
        first_name: firstName,
        last_name: lastName,
        email: email,
      });
      console.log('Данные обновлены:', response.data);
      Alert.alert('Успех', 'Данные пользователя успешно обновлены.');
      navigation.popToTop();
    } catch (error) {
      console.log(
        'Ошибка при обновлении данных:',
        error.response || error.message,
      );
      Alert.alert('Ошибка', 'Не удалось обновить данные пользователя.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Информация о пользователе</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="Имя"
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Фамилия"
        placeholderTextColor="#ccc"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="E-mail"
        keyboardType="email-address"
        placeholderTextColor="#ccc"
      />
      <TouchableOpacity onPress={handleSave}>
        <Text style={styles.buttonSubmit}>Сохранить изменения</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Назад</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F6F8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  buttonSubmit: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 15,
  },
  backText: {
    color: '#007bff',
    fontSize: 17,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default InfoUser;
