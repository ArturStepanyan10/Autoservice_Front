import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import RecordOnService from '../screens/client/RecordOnService';
import {HomeTabs} from './tabs';
import Registration from '../screens/client/Registration';
import InfoUser from '../screens/client/InfoUser';
import Profile from '../screens/client/Profile';
import Appointments from '../screens/client/Appointments';
import AddCar from '../screens/client/AddCar';
import Car from '../screens/client/Car';
import EditCar from '../screens/client/EditCar';
import Reviews from '../screens/client/Reviews';
import ResetPassword from '../screens/client/ResetPassword';
import PasswordResetConfirm from '../screens/client/PasswordResetConfirm';
import {AuthContext} from '../contexts/authContext';
import Home from '../screens/worker/Home';

const Stack = createStackNavigator();

function Navigator() {
  const {role} = useContext(AuthContext);

  return (
    <Stack.Navigator initialRouteName="Home">
      {role === 'ROLE_CLIENT' ? (
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
            options={{headerShown: false}}
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
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={Home} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default Navigator;
