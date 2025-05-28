/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, Alert} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {Provider} from './src/contexts/globalContext.js';
import Navigator from './src/navigation/navigator.js';
import messaging from '@react-native-firebase/messaging';
import axios from './src/config/axiosConfig.js';
import {API_URL} from './src/config/apiConfig.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    // Настроить уведомления
    setupFCM();

    return () => {
      unsubscribeNetInfo();
    };
  }, []);

  // Настройка FCM
  async function setupFCM() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const fcmToken = await messaging().getToken();

      try {
        const jwtToken = await AsyncStorage.getItem('access');
        if (jwtToken) {
          await axios.post(
            `${API_URL}/api-notification/register-fcm-token/`,
            {fcm_token: fcmToken},
            {
              headers: {
                Authorization: `JWT ${jwtToken}`,
                'Content-Type': 'application/json',
              },
            },
          );
        }
      } catch (error) {
        console.log(
          'Ошибка при отправке FCM токена:',
          error.response?.data || error.message,
        );
      }

      // Обработка входящих уведомлений, когда приложение открыто
      messaging().onMessage(async remoteMessage => {
        if (remoteMessage.notification) {
          Alert.alert(
            remoteMessage.notification.title,
            remoteMessage.notification.body,
          );
        }
      });
    }
  }

  if (!isConnected) {
    return (
      <View style={styles.noInternetContainer}>
        <Text style={styles.noInternetText}>Нет подключения к интернету</Text>
      </View>
    );
  }

  return (
    <Provider>
      <View style={{flex: 1}}>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  noInternetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
  },
  noInternetText: {
    color: '#721c24',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
