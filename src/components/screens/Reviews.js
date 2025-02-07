import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Image, Alert} from 'react-native';
import axios from '../elements/axiosConfig';
import {AirbnbRating} from 'react-native-ratings';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StarRating = ({rating}) => {
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    return <Text style={styles.stars}>{stars}</Text>;
};

function Reviews({route}) {
    const {serviceId} = route.params || {};
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({content: '', rating: 1});
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`http://192.168.8.116:8000/api/reviews/`, {
                    params: {service_id: serviceId},
                });

                setReviews(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('access');
            setIsAuthenticated(!!token);
        };

        fetchReviews();
        checkAuth();
    }, [serviceId]);

    const handleAddReview = async () => {
        try {
            const response = await axios.post('http://192.168.8.116:8000/api/reviews/', {
                rating: newReview.rating,
                content: newReview.content,
                service: serviceId,
            });

            setReviews((prevReviews) => [response.data, ...prevReviews]);
            setNewReview({content: '', rating: 1});
            setIsFormVisible(false);
        } catch (error) {
            if (error.response) {
                console.error('Ошибка от сервера:', error.response.data);
                Alert.alert('Ошибка при добавлении отзыва: ' + error.response.data.detail);
            } else {
                console.error('Ошибка при отправке запроса:', error.message);
                Alert.alert('Ошибка при отправке запроса');
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={require('../assets/images/arrow_back.png')}
                        style={styles.arrow_back}
                    />
                </TouchableOpacity>
                <Text style={styles.header}>Отзывы</Text>
            </View>
            {reviews.length > 0 ? (
                <FlatList
                    data={reviews}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({item}) => (
                        <View style={styles.reviewCard}>
                            <Text style={styles.reviewAuthor}>
                                {item.user.first_name} {item.user.last_name} - <StarRating rating={item.rating}/>
                            </Text>
                            <Text style={styles.reviewText}>{item.content}</Text>
                        </View>
                    )}
                />
            ) : (
                <Text style={styles.noReviews}>Нет отзывов для этой услуги</Text>
            )}

            {isAuthenticated && (
                <>
                    <TouchableOpacity
                        style={styles.buttonSumbit}
                        onPress={() => setIsFormVisible(!isFormVisible)}
                    >
                        <Text style={styles.buttonText}>
                            {isFormVisible ? 'Скрыть' : 'Добавить отзыв'}
                        </Text>
                    </TouchableOpacity>

                    {isFormVisible && (
                        <View style={styles.formContainer}>
                            <View style={styles.rating}>
                                <Text style={styles.ratingLabel}>Оцените услугу:</Text>
                                <AirbnbRating
                                    count={5}
                                    defaultRating={1}
                                    reviews={[]}
                                    size={30}
                                    onFinishRating={(rating) =>
                                        setNewReview({...newReview, rating})
                                    }
                                />
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Ваше впечатление (не обязательно)"
                                value={newReview.content}
                                onChangeText={(text) =>
                                    setNewReview({...newReview, content: text})
                                }
                                placeholderTextColor="#ccc"
                            />
                            <TouchableOpacity onPress={handleAddReview}>
                                <Text style={styles.buttonSumbit}>Отправить</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F6F8',
        padding: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        marginRight: 20,
        flex: 1,
    },
    arrow_back: {
        width: 30,
        height: 30,
    },
    reviewCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
        elevation: 2,
    },
    reviewText: {
        fontSize: 16,
        marginBottom: 8,
    },
    reviewAuthor: {
        fontSize: 18,
        color: '#555',
        fontWeight: 'bold',
    },
    noReviews: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 50,
        color: '#777',
    },
    formContainer: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginTop: 16,
        elevation: 2,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    ratingLabel: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    stars: {
        fontSize: 20,
        color: '#FFD700',
        marginBottom: 8,
    },
    rating: {
        marginBottom: 30,
    },
    buttonSumbit: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        color: '#fff',
        textAlign: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default Reviews;
