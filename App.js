import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {Context, Provider} from "./src/components/globalContext/globalContext.js";
import {View} from 'react-native';
import Navigator from "./src/components/navigation/navigator.js"


function App(props) {

    return(
        <Provider>
            <View style={{ flex:1 }}>
                <NavigationContainer>
                    <Navigator />
                </NavigationContainer>
            </View>

        </Provider>
    )
}

export default App;
