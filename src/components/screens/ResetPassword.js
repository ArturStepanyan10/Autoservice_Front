import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from '../elements/axiosConfig.js';

function ResetPassword() {
    const [email, setEmail] = useState('');

    const handleResetPassword = async () => {
        try {
            await axios.post('http://192.168.8.116:8000/api/password-reset-request/', { email });
            Alert.alert('Успешно', 'Инструкция по сбросу пароля отправлена на ваш email.');
        } catch (error) {
            console.error('Ошибка сброса пароля:', error);
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
            />
            <TouchableOpacity onPress={handleResetPassword} style={styles.button}>
                <Text style={styles.buttonText}>Сбросить пароль</Text>
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
});

export default ResetPassword;
