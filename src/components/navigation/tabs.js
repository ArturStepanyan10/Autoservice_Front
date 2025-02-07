import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/home';
import Car from '../screens/Car';
import Services from '../screens/Services';
import Dialogs from '../screens/Dialogs';
import Profile from '../screens/Profile';
import Icon from 'react-native-vector-icons/Ionicons';


const Tab = createBottomTabNavigator();

export const HomeTabs = () => {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: false,
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: 'black',

            tabBarIcon: ({ focused, color, size}) => {
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

                return <Icon name={iconName} size={focused? 30: size} color={color} />;
            }
        })} >

      <Tab.Screen name="HomeTabs" component={Home} />
      <Tab.Screen name="Car" component={Car} />
      <Tab.Screen name="Services" component={Services} />
      {/*<Tab.Screen name="Dialogs" component={Dialogs} />*/}
        <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}
