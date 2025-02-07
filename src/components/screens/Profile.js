import React, { useState, useEffect } from 'react';
import {Text, TouchableOpacity, StyleSheet, View, Image, Alert, TextInput, Linking} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserInfo from '../elements/UserInfo';
import axios from '../elements/axiosConfig.js';

function Profile() {
    const [isAuthenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const validateEmail = (email) => {
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
        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post('http://192.168.8.116:8000/api/login/', {
                email: email,
                password: password,
            });

            const { access, refresh } = response.data;

            if (response.data && access) {
                await AsyncStorage.setItem('access', access);
                await AsyncStorage.setItem('refresh', refresh);
                setAuthenticated(true);
            }
            navigation.navigate("Home")
            Alert.alert('Успешный вход!');
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Ошибка', 'Неверный логин или пароль');
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('access');
            setAuthenticated(!!token);
        };
        checkAuth();
    }, []);

    const navigateInfoUser = () => {
        if (user) {
            navigation.navigate('InfoUser', { userData: user });
        }
    };

    const navigateRegistration = () => {
        navigation.navigate('Registration')
    }

    const navigateAppointments = () => {
        navigation.navigate('Appointments')
    }

    const handleLogout = async () => {
        Alert.alert(
            "Подтверждение",
            "Вы уверены, что хотите выйти из аккаунта?",
            [
                {
                    text: "Отмена",
                    style: "cancel",
                },
                {
                    text: "Да",
                    onPress: async () => {
                        await AsyncStorage.removeItem('access');
                        await AsyncStorage.removeItem('refresh');
                        setAuthenticated(false);
                        setUser(null);
                        setEmail('');
                        setPassword('');
                        Alert.alert('Выход выполнен');
                    },
                },
            ],
            { cancelable: false }
        );
    };

    const openMarkdownInstructions = () => {
        const markdownUrl = 'https://arturstepanyan10.github.io/Documentation_Autoservice/';
        Linking.openURL(markdownUrl).catch((err) =>
            Alert.alert('Ошибка', 'Не удалось открыть инструкцию. Попробуйте позже.')
        );
    };

    return (
        <View style={styles.container}>
            {isAuthenticated ? (
                <>
                    <Text style={styles.header}>ПРОФИЛЬ</Text>

                    <UserInfo setUser={setUser} />

                    {user ? (
                        <View style={styles.userInfo}>
                            <View style={styles.circle}>
                                <Text style={styles.initials}>{user.first_name[0] || ''}{user.last_name[0] || ''}</Text>
                            </View>
                            <View style={styles.userDetails}>
                                <Text style={styles.info}>{user.first_name} {user.last_name}</Text>
                                <TouchableOpacity onPress={navigateInfoUser} style={styles.settingsIconContainer}>
                                    <Image
                                        source={require('../assets/images/settings.png')}
                                        style={styles.iconSettings}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <Text>Загрузка данных пользователя...</Text>
                    )}

                    <View style={styles.appointmentsBlock}>
                        <TouchableOpacity onPress={navigateAppointments}>
                            <Text style={styles.blockAppointment}>История записей на сервис</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={openMarkdownInstructions}>
                        <View style={styles.aboutAppBlock}>
                            <Text style={styles.aboutAppText}>О приложении</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleLogout}>
                        <View style={styles.logoutBlock}>
                            <Text style={styles.logout}>Выйти из аккаунта</Text>
                        </View>
                    </TouchableOpacity>
                </>
            ) : (
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
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                    <TouchableOpacity onPress={handleLogin}>
                        <View style={styles.authButton}>
                            <Text style={styles.authButtonText}>Войти</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={navigateRegistration}>
                        <View style={styles.authButton}>
                            <Text style={styles.authButtonText}>Зарегистрироваться</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('ResetPassword')}>
                        <Text style={styles.Text}>Забыли пароль ?</Text>
                    </TouchableOpacity>

                </View>
            )}
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
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 10,
    },
    userDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    info: {
        fontSize: 25,
        fontWeight: '500',
        marginLeft: 20,
        flex: 1,
    },
    circle: {
        width: 60,
        height: 60,
        borderRadius: 40,
        backgroundColor: '#007bff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        fontSize: 25,
        color: '#fff',
        fontWeight: 'bold',
    },
    settingsIconContainer: {
        marginLeft: 10,
    },
    iconSettings: {
        width: 55,
        height: 55,
    },
    appointmentsBlock: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        marginTop: 20,
    },
    blockAppointment: {
        fontSize: 18,
        marginBottom: 10,
        textAlign: 'center',

    },
    logoutBlock: {
        marginTop: 400,
        borderRadius: 8,
        backgroundColor: 'red',
        width: 250,
        height: 50,
        alignSelf: 'center',
        justifyContent: 'center',
    },
    logout: {
        fontSize: 20,
        textAlign: 'center',
        color: 'white',
    },
    authForm: {
        marginTop: 20,
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
    aboutAppBlock: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
        marginTop: 20,
        alignItems: 'center',
    },
    aboutAppText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default Profile;
