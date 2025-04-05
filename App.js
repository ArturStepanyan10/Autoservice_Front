/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import NetInfo from '@react-native-community/netinfo';
import {Provider} from './src/contexts/globalContext.js';
import Navigator from './src/navigation/navigator.js';
import {AuthProvider} from './src/contexts/authContext.js';

function App() {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  if (!isConnected) {
    return (
      <View style={styles.noInternetContainer}>
        <Text style={styles.noInternetText}>Нет подключения к интернету</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <Provider>
        <View style={{flex: 1}}>
          <NavigationContainer>
            <Navigator />
          </NavigationContainer>
        </View>
      </Provider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  noInternetContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
  },
  noInternetText: {
    color: '#721c24',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;
