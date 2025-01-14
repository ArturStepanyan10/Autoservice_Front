import React, { useState } from 'react';
import {View, Text, TextInput, Image, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import axios from '../elements/axiosConfig';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';


function AddCar() {
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [color, setColor] = useState('');
    const [vin, setVin] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [photo, setPhoto] = useState(null);
    const navigation = useNavigation();


    const handleImagePick = async () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                quality: 0.8,
            },
            (response) => {
                if (response.didCancel) {
                    console.log('Выбор фото отменен');
                } else if (response.errorMessage) {
                    console.error('Ошибка при выборе изображения:', response.errorMessage);
                } else {
                    const selectedPhoto = response.assets[0];
                    setPhoto(selectedPhoto);
                }
            }
        );
    };

    const handleSubmit = async () => {
        if (!brand || !model || !vin || !licensePlate) {
            Alert.alert('Ошибка', 'Заполните все поля!');
            return;
        }

        const carData = new FormData();
        carData.append('brand', brand);
        carData.append('model', model);
        carData.append('year', parseInt(year, 10));
        carData.append('color', color);
        carData.append('vin', vin);
        carData.append('license_plate', licensePlate);

        if (photo) {
            carData.append('photo', {
                uri: photo.uri,
                type: photo.type,
                name: photo.fileName || 'photo.jpg',
            });
        }
        try {
            const response = await axios.post('http://192.168.8.116:8000/api/carslist/', carData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 201) {
                Alert.alert('Успех', 'Машина успешно добавлена!');
                navigation.popToTop();

                setBrand('');
                setModel('');
                setYear('');
                setColor('');
                setVin('');
                setLicensePlate('');
            }
        } catch (error) {
            console.error('Ошибка при добавлении машины:', error);
            Alert.alert('Ошибка', 'Не удалось добавить машину. Проверьте данные и повторите попытку.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Добавление автомобиля</Text>
            <TextInput
                style={styles.input}
                placeholder="Марка (например, BMW)"
                value={brand}
                onChangeText={setBrand}
                placeholderTextColor="#ccc"
            />
            <TextInput
                style={styles.input}
                placeholder="Модель (например, M5 F90)"
                value={model}
                placeholderTextColor="#ccc"
                onChangeText={setModel}
            />
            <TextInput
                style={styles.input}
                placeholder="Год выпуска (например, 2020)"
                value={year}
                onChangeText={setYear}
                placeholderTextColor="#ccc"
                keyboardType="numeric"
            />
            <TextInput
                style={styles.input}
                placeholder="Цвет (например, черный)"
                value={color}
                onChangeText={setColor}
                placeholderTextColor="#ccc"
            />
            <TextInput
                style={styles.input}
                placeholder="VIN (например, XTAFTA211440A1234567)"
                value={vin}
                placeholderTextColor="#ccc"
                onChangeText={setVin}
            />
            <TextInput
                style={styles.input}
                placeholder="Гос. номер (например, А005АА33)"
                value={licensePlate}
                placeholderTextColor="#ccc"
                onChangeText={setLicensePlate}
            />
            <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePick}>
                <Text style={styles.imagePickerText}>Выбрать фото</Text>
            </TouchableOpacity>
            {photo && (
                <Image
                    source={{ uri: photo.uri }}
                    style={styles.imagePreview}
                />
            )}
            <TouchableOpacity onPress={handleSubmit}>
                <Text style={styles.addCar}>Добавить автомобиль</Text>
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
    addCar: {
        width: '90%',
        textAlign: 'center',
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 8,
        alignItems: 'center',
        alignSelf: 'center',
        color: "#fff",
        marginTop: 20,
        fontSize: 18
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
});

export default AddCar;
