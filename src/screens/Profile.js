import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Image,
  Alert,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserInfo from '../../src/API/GET/UserInfo.js';
import Auth from './Authorization.js';

function Profile() {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('access');
      setAuthenticated(!!token);
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Подтверждение',
      'Вы уверены, что хотите выйти из аккаунта?',
      [
        {text: 'Отмена', style: 'cancel'},
        {
          text: 'Да',
          onPress: async () => {
            await AsyncStorage.removeItem('access');
            await AsyncStorage.removeItem('refresh');
            setAuthenticated(false);

            Alert.alert('Выход выполнен');
          },
        },
      ],
      {cancelable: false},
    );
  };

  const navigateAppointments = () => navigation.navigate('Appointments');
  const navigateInfoUser = () =>
    user && navigation.navigate('InfoUser', {userData: user});
  const openMarkdownInstructions = () => {
    Linking.openURL(
      'https://arturstepanyan10.github.io/Documentation_Autoservice/',
    ).catch(() =>
      Alert.alert('Ошибка', 'Не удалось открыть инструкцию. Попробуйте позже.'),
    );
  };

  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <>
          <UserInfo setUser={setUser} />
          {user ? (
            <View style={styles.userInfo}>
              <View style={styles.circle}>
                <Text style={styles.initials}>
                  {user.first_name[0] || ''}
                  {user.last_name[0] || ''}
                </Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.info}>
                  {user.first_name} {user.last_name}
                </Text>
                <TouchableOpacity
                  onPress={navigateInfoUser}
                  style={styles.settingsIconContainer}>
                  <Image
                    source={require('../assets/images/settings.png')}
                    style={styles.iconSettings}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <Text>Загрузка данных пользователя...</Text>
          )}

          {user && user.role === 'ROLE_CLIENT' && (
            <TouchableOpacity onPress={navigateAppointments}>
              <Text style={styles.blockAppointment}>
                История записей на сервис
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={openMarkdownInstructions}
            style={styles.aboutAppBlock}>
            <Text style={styles.aboutAppText}>О приложении</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBlock}>
            <Text style={styles.logout}>Выйти из аккаунта</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Auth setAuthenticated={setAuthenticated} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    padding: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    borderColor: '#007bff',
    borderWidth: 2,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  info: {
    fontSize: 25,
    fontWeight: '500',
    marginLeft: 20,
    flex: 1,
  },
  circle: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 25,
    color: '#fff',
    fontWeight: 'bold',
  },
  settingsIconContainer: {
    marginLeft: 10,
  },
  iconSettings: {
    width: 55,
    height: 55,
  },
  appointmentsBlock: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  blockAppointment: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
    color: '#fff',
  },
  aboutAppBlock: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  aboutAppText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  logoutBlock: {
    position: 'absolute',
    top: 620,
    marginTop: 20,
    borderRadius: 8,
    backgroundColor: '#B00000',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  logout: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
  },
});

export default Profile;
