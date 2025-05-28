import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {GlobalContext} from '../contexts/globalContext';

import RecordOnService from '../screens/client/RecordOnService';
import {HomeTabs} from './tabs';
import Registration from '../screens/client/Registration';
import InfoUser from '../screens/client/InfoUser';
import Profile from '../screens/Profile';
import Appointments from '../screens/client/Appointments';
import AddCar from '../screens/client/AddCar';
import Car from '../screens/client/Car';
import EditCar from '../screens/client/EditCar';
import Reviews from '../screens/client/Reviews';
import ResetPassword from '../screens/client/ResetPassword';
import PasswordResetConfirm from '../screens/client/PasswordResetConfirm';

import PastRecords from '../screens/worker/PastRecords';
import FutureRecords from '../screens/worker/FutureRecords';
import ChatScreen from '../screens/Chat';
import ChatBot from '../screens/client/ChatBot';
import LoyaltyProgram from '../screens/client/LoyaltyProgram';

const Stack = createStackNavigator();

function Navigator() {
  const {user} = useContext(GlobalContext);
  const role = user?.role;

  return (
    <Stack.Navigator>
      {role === 'ROLE_WORKER' ? (
        <>
          <Stack.Screen
            name="HomeWorker"
            component={HomeTabs}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PastRecords"
            component={PastRecords}
            options={{
              headerStyle: {backgroundColor: '#007bff'},
              headerTintColor: '#fff',
              headerTitleStyle: {fontSize: 20},
              title: 'Прошлые записи',
            }}
          />
          <Stack.Screen
            name="FutureRecords"
            component={FutureRecords}
            options={{
              headerStyle: {backgroundColor: '#007bff'},
              headerTintColor: '#fff',
              headerTitleStyle: {fontSize: 20},
              title: 'Будущие записи',
            }}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{
              headerStyle: {backgroundColor: '#007bff'},
              headerTintColor: '#fff',
              headerTitleStyle: {fontSize: 20},
              title: 'Диалог',
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={HomeTabs}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="RecordOnService"
            component={RecordOnService}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Registration"
            component={Registration}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="InfoUser"
            component={InfoUser}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Appointments"
            component={Appointments}
            options={{
              headerStyle: {backgroundColor: '#007bff'},
              headerTintColor: '#fff',
              headerTitleStyle: {fontSize: 20},
              title: 'Записи на сервис',
            }}
          />
          <Stack.Screen
            name="AddCar"
            component={AddCar}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Car"
            component={Car}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="EditCar"
            component={EditCar}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Reviews"
            component={Reviews}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPassword}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PasswordResetConfirm"
            component={PasswordResetConfirm}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Chat"
            component={ChatScreen}
            options={{
              headerStyle: {backgroundColor: '#007bff'},
              headerTintColor: '#fff',
              headerTitleStyle: {fontSize: 20},
              title: 'Диалог',
            }}
          />
          <Stack.Screen
            name="ChatBot"
            component={ChatBot}
            options={{
              headerStyle: {backgroundColor: '#007bff'},
              headerTintColor: '#fff',
              headerTitleStyle: {fontSize: 20},
              title: 'ЧАТ-БОТ',
            }}
          />
          <Stack.Screen
            name="LoyaltyProgram"
            component={LoyaltyProgram}
            options={{
              headerStyle: {backgroundColor: '#007bff'},
              headerTintColor: '#fff',
              headerTitleStyle: {fontSize: 20},
              title: 'Программа лояльности',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default Navigator;
