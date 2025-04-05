/* eslint-disable react/no-unstable-nested-components */
import React, {useContext} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/client/home';
import Car from '../screens/client/Car';
import Services from '../screens/client/Services';
import Dialogs from '../screens/client/Dialogs';
import Profile from '../screens/client/Profile';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../contexts/authContext';

const Tab = createBottomTabNavigator();

export const HomeTabs = () => {
  const {role} = useContext(AuthContext);

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'black',

        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'HomeTabs') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Car') {
            iconName = focused ? 'car' : 'car-outline';
          } else if (route.name === 'Services') {
            iconName = focused ? 'construct' : 'construct-outline';
          } else if (route.name === 'Dialogs') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <Icon name={iconName} size={focused ? 30 : size} color={color} />
          );
        },
      })}>
      {role === 'ROLE_CLIENT' ? (
        <>
          <Tab.Screen name="HomeTabs" component={Home} />
          <Tab.Screen name="Car" component={Car} />
          <Tab.Screen name="Services" component={Services} />
          <Tab.Screen name="Dialogs" component={Dialogs} />
          <Tab.Screen name="Profile" component={Profile} />
        </>
      ) : (
        <>
          <Tab.Screen name="Home" component={Home} />
        </>
      )}
    </Tab.Navigator>
  );
};
