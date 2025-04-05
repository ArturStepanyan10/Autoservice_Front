import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import axios from '../../config/axiosConfig.js';
import {useNavigation} from '@react-navigation/native';

function PasswordResetConfirm() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();

  const handlePasswordResetConfirm = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Ошибка', 'Введите корректный email.');
      return;
    }

    const codeRegex = /^\d{7}$/;
    if (!codeRegex.test(code)) {
      Alert.alert('Ошибка', 'Код должен состоять ровно из 7 цифр.');
      return;
    }

    if (newPassword === '' || confirmPassword === '') {
      Alert.alert('Ошибка', 'Пароль не может быть пустым.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Ошибка', 'Пароли не совпадают. Пожалуйста, повторите ввод.');
      return;
    }

    try {
      const response = await axios.post(
        'http://192.168.8.116:8000/api/password-reset/confirm/',
        {
          email,
          code,
          new_password: newPassword,
        },
      );

      if (response.status === 200) {
        Alert.alert('Успешно', 'Пароль успешно изменён.');
        navigation.goBack();
      }
    } catch (error) {
      console.log(
        'Ошибка при сбросе пароля:',
        error.response?.data || error.message,
      );
      Alert.alert('Ошибка', 'Не удалось изменить пароль. Проверьте данные.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Новый пароль</Text>

      <TextInput
        style={styles.input}
        placeholder="Введите ваш email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#ccc"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Введите код восстановления"
        value={code}
        onChangeText={setCode}
        placeholderTextColor="#ccc"
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Введите новый пароль"
        value={newPassword}
        onChangeText={setNewPassword}
        placeholderTextColor="#ccc"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Подтвердите новый пароль"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor="#ccc"
        secureTextEntry
      />
      <TouchableOpacity
        onPress={handlePasswordResetConfirm}
        style={styles.button}>
        <Text style={styles.buttonText}>Подтвердить новый пароль</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.text}>Назад</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    color: 'black',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  text: {
    color: '#007bff',
    fontSize: 17,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default PasswordResetConfirm;
