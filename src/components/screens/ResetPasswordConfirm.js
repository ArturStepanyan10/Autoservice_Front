import React from "react";
import { View, Text } from "react-native";

const ResetPasswordConfirm = ({ route }) => {
    const { uid, token } = route.params;

    return (
        <View>
            <Text>UID: {uid}</Text>
            <Text>Token: {token}</Text>
        </View>
    );
};

export default ResetPasswordConfirm;
