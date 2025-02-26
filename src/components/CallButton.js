import React from "react";
import {Alert, Linking, TouchableOpacity, View, StyleSheet, Image} from 'react-native';


function CallButton({ phoneNumber = '+7 (900) 589-52-18' }) {

    const makeCall = () => {
        const url = `tel: ${phoneNumber}`;
        Linking.openURL(url)
            .then((supportedUrl) => {
                if (supportedUrl) {
                    Linking.openURL(url);
                } else {
                    Alert.alert('Ошибка', 'Ваше устройство не поддерживает звонки.')
                }
            })
            .catch((err) => console.error('Ошибка:', err))
    };

    return (
        <View >
            <TouchableOpacity onPress={makeCall}>
                    <Image
                        source={require('../assets/images/call.png')}
                        style={styles.callIcon}
                        resizeMode='center'/>
            </TouchableOpacity>
        </View>
    )
}

const styles= StyleSheet.create({
    callIcon: {
        width: 24,
        height: 24,
        borderRadius: 8,
        padding: 15,
        backgroundColor: '#007AFF'
    }
})

export default CallButton;
