import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

function Car() {
    const [cars, setCars] = useState([]);
    const navigation = useNavigation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchCars = async () => {
        try {
            const token = await AsyncStorage.getItem('access');

            if (!token) {
                console.log("No access token found!");
                setIsAuthenticated(false);
                return;
            }

            const response = await axios.get('http://192.168.8.116:8000/api/carslist/', {
                headers: {
                    Authorization: `JWT ${token}`,
                },
            });

            console.log('Fetched cars:', response.data);
            setCars(response.data);
            setIsAuthenticated(true);
        } catch (error) {
            console.log('Error fetching cars:', error.response?.data || error.message);
            setIsAuthenticated(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCars();
        }, [])
    );

    const navigateToProfile = () => {
        navigation.navigate('Profile');
    };

    const navigateToAddCar = () => {
        if (isAuthenticated) {
            navigation.navigate('AddCar');
        } else {
            Alert.alert("Авторизация", "Вы не авторизованы!")
        }
    };

    const navigateToEditCar = (carId) => {
        navigation.navigate('EditCar', { carId });
    };

    const handleDeleteCar = async (carId) => {
        try {
            const token = await AsyncStorage.getItem('access');
            if (!token) {
                Alert.alert('Ошибка', 'Вы не авторизованы.');
                return;
            }

            await axios.delete(`http://192.168.8.116:8000/api/carslist/${carId}/`, {
                headers: {
                    Authorization: `JWT ${token}`,
                },
            });

            Alert.alert('Успех', 'Автомобиль успешно удален.');
            fetchCars();
        } catch (error) {
            console.log('Error deleting car:', error.response?.data || error.message);
            Alert.alert('Ошибка', 'Не удалось удалить автомобиль.');
        }
    };

    const confirmDeleteCar = (carId) => {
        Alert.alert(
            'Подтверждение удаления',
            'Вы уверены, что хотите удалить этот автомобиль?',
            [
                {
                    text: 'Отмена',
                    style: 'cancel',
                },
                {
                    text: 'Удалить',
                    onPress: () => handleDeleteCar(carId),
                    style: 'destructive',
                },
            ]
        );
    };

    const renderCar = ({ item }) => (
        <View style={styles.card}>
            <TouchableOpacity onPress={() => navigateToEditCar(item.id)}>
                <Image
                    source={require('../assets/images/edit.png')}
                    style={styles.edit}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmDeleteCar(item.id)}>
                <Image
                    source={require('../assets/images/delete.png')}
                    style={styles.delete}
                />
            </TouchableOpacity>
            <Text style={styles.carName}>{item.brand}</Text>
            <Text style={styles.carDetails}>Модель: {item.model}</Text>
            <Text style={styles.carDetails}>Год: {item.year}</Text>
            <Text style={styles.carDetails}>ГОС №: {item.license_plate}</Text>
            <Text style={styles.carDetails}>VIN №: {item.vin}</Text>
            {item.photo && (
                <Image
                    source={{ uri: item.photo }}
                    style={styles.carImage}
                    resizeMode="cover"
                />
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>ВАШИ АВТОМОБИЛИ</Text>
                <TouchableOpacity onPress={navigateToAddCar} style={styles.addCarContainer}>
                    <Image source={require('../assets/images/add.png')} style={styles.addCar} />
                </TouchableOpacity>
            </View>
            {isAuthenticated ? (
                cars.length > 0 ? (
                    <FlatList
                        data={cars}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderCar}
                    />
                ) : (
                    <>
                        <Text style={styles.noCars}>У вас пока нет автомобилей</Text>
                        <TouchableOpacity onPress={navigateToAddCar}>
                            <Text style={styles.buttonsCar}>Добавить автомобиль</Text>
                        </TouchableOpacity>
                    </>
                )
            ) : (
                <>
                    <Text style={styles.noCars}>
                        Пока у вас нет добавленных автомобилей. Для этого нужно авторизоваться.
                    </Text>
                    <TouchableOpacity onPress={navigateToProfile}>
                        <Text style={styles.buttonsCar}>Авторизоваться</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
    addCarContainer: {
        position: 'absolute',
        right: 16,
    },
    addCar: {
        width: 30,
        height: 30,
    },
    card: {
        backgroundColor: '#fff',
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
        position: 'relative',
    },
    edit: {
        width: 36,
        height: 36,
        position: 'absolute',
        top: 8,
        right: 40,
    },
    delete: {
        width: 36,
        height: 36,
        position: 'absolute',
        top: 8,
        right: 8,
    },
    carName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    carDetails: {
        fontSize: 14,
        color: '#555',
    },
    noCars: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
    carImage: {
        width: '100%',
        height: 200,
        marginTop: 10,
        borderRadius: 8,
    },
    buttonsCar: {
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 8,
        alignItems: 'center',
        alignSelf: 'center',
        color: "#fff",
        marginTop: 20,
        fontSize: 20,
    },
});

export default Car;
