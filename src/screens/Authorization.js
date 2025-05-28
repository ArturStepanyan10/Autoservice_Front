import React, {useContext, useState} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../config/axiosConfig.js';
import {API_URL} from '../config/apiConfig.js';
import {jwtDecode} from 'jwt-decode';
import {GlobalContext} from '../contexts/globalContext.js';

const Authorization = ({setAuthenticated}) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const {setUser} = useContext(GlobalContext);

  const validateEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    let valid = true;
    if (!email || !validateEmail(email)) {
      setEmailError('Введите корректный E-mail');
      valid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Пароль не может быть пустым');
      valid = false;
    } else {
      setPasswordError('');
    }

    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post(`${API_URL}/api-base/login/`, {
        email,
        password,
      });

      const {access, refresh} = response.data;

      if (access) {
        const decodedToken = jwtDecode(access);
        const role = decodedToken?.role || 'ROLE_CLIENT';
        setUser({
          role: role,
        });

        await AsyncStorage.setItem('access', access);
        await AsyncStorage.setItem('refresh', refresh);

        setAuthenticated(true);

        if (role === 'ROLE_WORKER') {
          navigation.navigate('HomeWorker');
        } else {
          navigation.navigate('Home');
        }
      }
    } catch (error) {
      console.log('Login error:', error);
      Alert.alert('Ошибка', 'Неверный логин или пароль');
    }
  };

  return (
    <View style={styles.authForm}>
      <Text style={styles.header}>Авторизация</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#ccc"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Пароль"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#ccc"
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={styles.togglePassword}>
            {showPassword ? 'Скрыть' : 'Показать'}
          </Text>
        </TouchableOpacity>
      </View>
      {passwordError ? (
        <Text style={styles.errorText}>{passwordError}</Text>
      ) : null}

      <TouchableOpacity onPress={handleLogin}>
        <View style={styles.authButton}>
          <Text style={styles.authButtonText}>Войти</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
        <View style={styles.authButton}>
          <Text style={styles.authButtonText}>Зарегистрироваться</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
        <Text style={styles.Text}>Забыли пароль?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  authForm: {
    marginTop: 20,
  },
  header: {
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#007bff',
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    alignSelf: 'center',
    marginBottom: 10,
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    color: 'black',
  },
  togglePassword: {
    marginLeft: 10,
    color: '#007bff',
    fontSize: 16,
  },
  authButton: {
    width: '90%',
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  authButtonText: {
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
});

export default Authorization;
