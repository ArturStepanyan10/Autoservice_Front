import React, { useContext, useEffect, useState } from 'react';
import {View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Context } from "../globalContext/globalContext.js";
import CallButton from '../elements/CallButton';
import { useNavigation } from '@react-navigation/native';


function Home(props) {
    const navigation = useNavigation();

    const navigateToRecordService = () => {
        navigation.navigate('RecordOnService');
    };

    const navigateToAddCar = () => {
        navigation.navigate('Car')
    };

    return (

        <View style={styles.container}>
            <View style={styles.header}>

                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.logo}/>
                <View style={styles.headerContainer}>
                    <Text style={styles.nameText}>АВТОМАСТЕР</Text>
                    <Text style={styles.nameOrg}>АВТОСЕРВИС</Text>
                </View>
            </View>
            <Text style={styles.stock}>Акция</Text>
            <Image
                source={require('../assets/images/skidka.png')}
                style={styles.discount}/>

            <View style={styles.callContainer}>
                <Text style={styles.phoneNumber}>
                    АВТОМАСТЕР     +7 (900) 589-52-18
                </Text>
                <CallButton style={styles.callIcon} phoneNumber="+7 (900) 589-52-18"/>

            </View>

            <TouchableOpacity onPress={navigateToRecordService}>
                <Text style={styles.record}>Записаться на сервис</Text>
            </TouchableOpacity>

            <Text style={styles.recommendation}>Рекомендация</Text>
            <View style={styles.box}>
                <Text style={styles.recommendationBlock}>Добавьте автомобиль для удобной записи
                    и получения рекомендаций</Text>
            </View>
            <TouchableOpacity onPress={navigateToAddCar}>
                <View style={styles.recommendationContainer}>
                    <Text style={styles.recommendationText}>
                        Добавить автомобиль
                    </Text>
                <Image
                    source={require('../assets/images/car.png')}
                    style={styles.carIcon}/>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles= StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F6F8',
        padding: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerContainer: {
        padding: 10,
        borderRadius: 8,
        width: 200,
        alignSelf: 'center',
        backgroundColor: "#007AFF",
    },
    logo: {
        borderRadius: 20,
        width: 70,
        height: 70,
        marginRight: 10
    },
    nameText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        //fontFamily: 'Montserrat-VariableFont_wght'
    },
    nameOrg: {
        fontSize: 13,
        textAlign: 'center',
        color: 'white'
    },
    stock: {
        fontSize: 18,
        marginTop: 15,
    },
    discount: {
        width: '100%',
        height: 225,
        resizeMode: 'cover',
        alignSelf: 'center',
        marginTop: 10,

    },
    callContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: "#D3D3D3",
        marginTop: 20,
        padding: 10,
        borderRadius: 8,
    },
    phoneNumber: {
        color: "black",
        fontWeight: 'bold',
        marginRight: 40,
        fontSize: 17,
    },
    record: {
        width: 'auto',
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
        marginTop: 20,
        fontSize: 20
    },
    recommendation: {
        marginTop: 20,
        fontSize: 18
    },
    box: {
        width: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 10,
        borderWidth: 2,
        marginTop: 10
    },
    recommendationBlock: {
        fontSize: 20,
        color: 'white',
        //fontFamily: 'Montserrat-VariableFont_wght'
    },
    recommendationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: "#D3D3D3",
        marginTop: 15,
        padding: 10,
        borderRadius: 8,
    },
    recommendationText: {
        fontSize: 20,
    },
    carIcon: {
        width: 70,
        height: 70,
        marginLeft: 8,
        resizeMode: 'contain',
    },
    // statusText: {
    //     fontSize: 16,
    //     color: '#007AFF',
    //     marginBottom: 20,
    // },
    // serviceItem: {
    //     backgroundColor: 'white',
    //     padding: 15,
    //     borderRadius: 10,
    //     marginBottom: 10,
    //     shadowColor: 'rgba(0,0,0,0.1)',
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.2,
    //     shadowRadius: 2,
    // },
    // serviceTitle: {
    //     fontSize: 18,
    //     color: '#333',
    // },
});

export default Home;
