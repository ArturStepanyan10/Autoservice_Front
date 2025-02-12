import React, { useState } from 'react';
import { Alert, TextInput, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from '../components/elements/axiosConfig';
import { useNavigation } from '@react-navigation/native';

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Некорректный email')
        .required('Email обязателен'),
    password: Yup.string()
        .required('Пароль обязателен')
        .min(6, 'Пароль должен содержать не менее 6 символов'),
    phoneNumber: Yup.string()
        .required('Телефон обязателен')
        .matches(/^(\+7|8)\d{10}$/, 'Некорректный номер телефона'),
    firstName: Yup.string()
        .required('Имя обязательно')
        .min(2, 'Имя должно содержать не менее 2 символов'),
    lastName: Yup.string()
        .required('Фамилия обязательна')
        .min(2, 'Фамилия должна содержать не менее 2 символов'),
});

function Registration() {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();

    const handleRegistration = async (values) => {
        setLoading(true);
        try {
            const response = await axios.post('http://192.168.8.116:8000/api/auth/user/register/', {
                email: values.email,
                password: values.password,
                first_name: values.firstName,
                last_name: values.lastName,
                phone_number: values.phoneNumber,
            });

            if (response.status === 200) {
                Alert.alert('Успешная регистрация!', 'Вы успешно зарегистрированы!');
                navigation.navigate('Profile');
            }
        } catch (error) {
            console.log('Ошибка регистрации:', error);
            Alert.alert('Ошибка', 'Не удалось зарегистрировать пользователя.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Регистрация</Text>

            <Formik
                initialValues={{
                    email: '',
                    password: '',
                    phoneNumber: '',
                    firstName: '',
                    lastName: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleRegistration}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <View style={{ width: '100%' }}>
                        <TextInput
                            style={styles.input}
                            placeholder="E-mail"
                            value={values.email}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            placeholderTextColor="#ccc"
                        />
                        {touched.email && errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Пароль"
                                secureTextEntry={!showPassword}
                                value={values.password}
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                placeholderTextColor="#ccc"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Text style={styles.togglePassword}>
                                    {showPassword ? 'Скрыть' : 'Показать'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        {touched.password && errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

                        <TextInput
                            style={styles.input}
                            placeholder="Телефон"
                            value={values.phoneNumber}
                            onChangeText={handleChange('phoneNumber')}
                            onBlur={handleBlur('phoneNumber')}
                            placeholderTextColor="#ccc"
                        />
                        {touched.phoneNumber && errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

                        <TextInput
                            style={styles.input}
                            placeholder="Имя"
                            value={values.firstName}
                            onChangeText={handleChange('firstName')}
                            onBlur={handleBlur('firstName')}
                            placeholderTextColor="#ccc"
                        />
                        {touched.firstName && errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

                        <TextInput
                            style={styles.input}
                            placeholder="Фамилия"
                            value={values.lastName}
                            onChangeText={handleChange('lastName')}
                            onBlur={handleBlur('lastName')}
                            placeholderTextColor="#ccc"
                        />
                        {touched.lastName && errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.login}>
                            <Text style={styles.isAccount}>Есть аккаунт? </Text>
                            <TouchableOpacity onPress={() => navigation.goBack()}>
                                <Text style={styles.loginText}>Вход</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Formik>
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
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
    login: {
        flexDirection: 'row',
        marginTop: 20,
        alignSelf: 'center',
    },
    isAccount: {
        fontSize: 17,
    },
    loginText: {
        fontSize: 17,
        textDecorationLine: 'underline',
        color: '#007bff',
    },
});

export default Registration;
