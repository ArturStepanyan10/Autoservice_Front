import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Context, Provider } from "./src/components/globalContext/globalContext.js";
import { View } from 'react-native';
import Navigator from "./src/components/navigation/navigator.js"


const linking = {
  prefixes: ["myautoservice://"],
  config: {
    screens: {
      PasswordReset: "password-reset/:uid/:token",
    },
  },
};

function App(props) {

    return (
        <Provider>
            <View style={{ flex: 1 }}>
                <NavigationContainer linking={linking}>
                    <Navigator />
                </NavigationContainer>
            </View>

        </Provider>
    )
}

export default App;
