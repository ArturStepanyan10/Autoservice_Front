/* eslint-disable react/no-unstable-nested-components */
import React, {useContext, useState, useEffect} from 'react';
import {AppState} from 'react-native';
import {TouchableOpacity, Image, Alert} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import Home from '../screens/client/home';
import Car from '../screens/client/Car';
import Services from '../screens/client/Services';
import Dialogs from '../screens/Dialogs';
import Profile from '../screens/Profile';
import HomeWorker from '../screens/worker/HomeWorker';
import {GlobalContext} from '../contexts/globalContext';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

export const HomeTabs = () => {
  const navigation = useNavigation();
  const {user} = useContext(GlobalContext);
  const role = user?.role || 'ROLE_CLIENT';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  console.log(isAuthenticated);

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem('access');
      setIsAuthenticated(!!token);
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth(); // начальная проверка

    const unsubscribeFocus = navigation.addListener('focus', () => {
      checkAuth(); // при фокусе любого Tab
    });

    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        checkAuth(); // при возврате в приложение
      }
    });

    return () => {
      unsubscribeFocus();
      subscription.remove();
    };
  }, [user, navigation]);

  const navigateToAddCar = () => {
    if (isAuthenticated) {
      navigation.navigate('AddCar');
    } else {
      Alert.alert('Авторизация', 'Вы не авторизованы!');
    }
  };

  const commonOptions = {
    headerStyle: {backgroundColor: '#007bff'},
    headerTintColor: '#fff',
    headerTitleStyle: {fontWeight: '700', fontSize: 20},
  };

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'black',
        tabBarIcon: ({focused, color, size}) => {
          const icons = {
            Home: 'home',
            Car: 'car',
            Services: 'construct',
            Dialogs: 'chatbubble',
            Profile: 'person',
            HomeWorker: 'home',
          };
          const iconName = icons[route.name] || 'apps';
          return (
            <Icon
              name={focused ? iconName : `${iconName}-outline`}
              size={focused ? 30 : size}
              color={color}
            />
          );
        },
      })}>
      {role === 'ROLE_WORKER' ? (
        <>
          <Tab.Screen
            name="HomeWorker"
            component={HomeWorker}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Dialogs"
            component={Dialogs}
            options={{...commonOptions, headerTitle: 'ЧАТЫ'}}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{...commonOptions, headerTitle: 'ПРОФИЛЬ'}}
          />
        </>
      ) : (
        <>
          <Tab.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
          <Tab.Screen
            name="Car"
            component={Car}
            options={{
              ...commonOptions,
              headerTitle: 'МОИ АВТОМОБИЛИ',
              headerRight: () =>
                isAuthenticated ? (
                  <TouchableOpacity
                    onPress={navigateToAddCar}
                    style={{marginRight: 15}}>
                    <Image
                      source={require('../assets/images/add.png')}
                      style={{width: 30, height: 30}}
                    />
                  </TouchableOpacity>
                ) : null,
            }}
          />
          <Tab.Screen
            name="Services"
            component={Services}
            options={{
              ...commonOptions,
              headerTitle: 'УСЛУГИ АВТОСЕРВИСА',
            }}
          />
          <Tab.Screen
            name="Dialogs"
            component={Dialogs}
            options={{...commonOptions, headerTitle: 'ЧАТЫ'}}
          />
          <Tab.Screen
            name="Profile"
            component={Profile}
            options={{
              ...commonOptions,
              headerTitle: 'ПРОФИЛЬ',
              headerRight: () =>
                isAuthenticated ? (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Notifications');
                    }}
                    style={{marginRight: 15}}>
                    <Image
                      source={require('../assets/images/notifications.png')}
                      style={{width: 26, height: 26}}
                    />
                  </TouchableOpacity>
                ) : null,
            }}
          />
        </>
      )}
    </Tab.Navigator>
  );
};
