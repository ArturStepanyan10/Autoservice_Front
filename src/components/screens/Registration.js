import React, { useState } from 'react';
import {Alert, TextInput, Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import axios from '../elements/axiosConfig';
import { useNavigation } from '@react-navigation/native';

function Registration() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const navigation = useNavigation();

    const handleRegistration = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://192.168.8.116:8000/api/auth/user/register/', {
                email,
                password,
                first_name: firstName,
                last_name: lastName,
                phone_number: phoneNumber,
            });

            if (response.status === 200) {
                Alert.alert('Успешная регистрация!', 'Вы успешно зарегистрированы!');
                navigation.navigate('Profile');
            }
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            Alert.alert('Ошибка', 'Не удалось зарегистрировать пользователя.');
        } finally {
            setLoading(false);
        }
    };

    const navigateLogin = () => {
        navigation.navigate('Profile')
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Регистрация</Text>

            <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#ccc"
            />
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
            <TextInput
                style={styles.input}
                placeholder="Телефон"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholderTextColor="#ccc"
            />
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

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleRegistration}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                </Text>
            </TouchableOpacity>
            <View style={styles.login}>
                <Text style={styles.isAccount}>Есть аккаунт? </Text>
                <TouchableOpacity onPress={navigateLogin}>
                    <Text style={styles.loginText}>Вход</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F4F6F8',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
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
        width: '100%',
        padding: 15,
        backgroundColor: '#007bff',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonDisabled: {
        backgroundColor: '#b0c4de',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        alignSelf: 'center',
        marginBottom: 10,

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
    login: {
        flexDirection: 'row',
        marginTop: 20
    },
    isAccount:{
        fontSize: 17
    },
    loginText: {
        fontSize: 17,
        textDecorationLine: 'underline',
        color: '#007bff'
    }
});

export default Registration;
