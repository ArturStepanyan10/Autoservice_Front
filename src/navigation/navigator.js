import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RecordOnService from '../../screens/RecordOnService';
import {HomeTabs} from './tabs';
import Registration from '../../screens/Registration';
import InfoUser from '../../screens/InfoUser';
import Profile from '../../screens/Profile';
import Appointments from '../../screens/Appointments';
import AddCar from '../../screens/AddCar';
import Car from '../../screens/Car';
import EditCar from '../../screens/EditCar';
import Reviews from '../../screens/Reviews';
import ResetPassword from '../../screens/ResetPassword';
import PasswordResetConfirm from '../../screens/PasswordResetConfirm';


const Stack = createStackNavigator();

function Navigator() {
    return(
        <Stack.Navigator initialRouteName="Home" >
            <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
            <Stack.Screen name="RecordOnService" component={RecordOnService} options={{ headerShown: false }}/>
            <Stack.Screen name="Registration" component={Registration} options={{ headerShown: false }}/>
            <Stack.Screen name="InfoUser" component={InfoUser} options={{ headerShown: false }}/>
            <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name="Appointments" component={Appointments} options={{ headerShown: false }} />
            <Stack.Screen name="AddCar" component={AddCar} options={{ headerShown: false }} />
            <Stack.Screen name="Car" component={Car} options={{ headerShown: false }} />
            <Stack.Screen name="EditCar" component={EditCar} options={{ headerShown: false }} />
            <Stack.Screen name="Reviews" component={Reviews} options={{ headerShown: false }} />
            <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
            <Stack.Screen name="PasswordResetConfirm" component={PasswordResetConfirm} options={{ headerShown: false }} />
        </Stack.Navigator>
    )
}

export default Navigator;
