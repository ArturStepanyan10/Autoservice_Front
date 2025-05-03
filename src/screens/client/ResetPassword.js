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
import {API_URL} from '../../config/apiConfig.js';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Ошибка', 'Введите корректный email.');
      return;
    }

    try {
      await axios.post(`${API_URL}/api-base/password-reset-request/`, {email});
      Alert.alert(
        'Успешно',
        'Инструкция по сбросу пароля отправлена на ваш email.',
      );
      navigation.navigate('PasswordResetConfirm');
    } catch (error) {
      console.log('Ошибка сброса пароля:', error);
      Alert.alert('Ошибка', 'Не удалось отправить письмо. Проверьте email.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Восстановление пароля</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите ваш email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#ccc"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
        <Text style={styles.buttonText}>Сбросить пароль</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.Text}>Назад</Text>
      </TouchableOpacity>
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
  Text: {
    color: '#007bff',
    fontSize: 17,
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ResetPassword;
