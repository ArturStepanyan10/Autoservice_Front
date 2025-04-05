import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import axios from '../../config/axiosConfig';
import UserInfo from '../../components/UserInfo';
import {useNavigation} from '@react-navigation/native';
import GetServices from '../../components/GetServices';

function Appointments() {
  const [appointment, setAppointment] = useState([]);
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(
          'http://192.168.8.116:8000/api/appointmentlist/',
        );
        setAppointment(response.data);
      } catch (error) {
        console.log(
          'Ошибка при загрузке записей на сервис пользователя:',
          error,
        );
      }
    };
    fetchAppointment();
  }, []);

  const getStatusColor = status => {
    switch (status) {
      case 'ПОДТВЕРЖДЕНА':
        return {color: 'green'};
      case 'В ПРОЦЕССЕ':
        return {color: 'orange'};
      case 'ЗАВЕРШЕНА':
        return {color: 'blue'};
      default:
        return {color: 'gray'};
    }
  };

  const getServiceNameById = serviceId => {
    const service = services.find(service => service.id === serviceId);
    return service ? service.title : 'Неизвестная услуга';
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/images/arrow_back.png')}
            style={styles.arrow_back}
          />
        </TouchableOpacity>
        <Text style={styles.header}>Записи на сервис</Text>
      </View>

      <GetServices setServices={setServices} />

      {appointment.length > 0 ? (
        <FlatList
          data={appointment}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.appointmentCard}>
              <UserInfo setUser={setUser} />
              {user ? (
                <>
                  <Text style={styles.title}>
                    {getServiceNameById(item.service)}
                  </Text>
                  <Text>Дата: {item.date}</Text>
                  <Text>Время: {item.time}</Text>
                  <Text>
                    Имя клиента: {user.first_name} {user.last_name}
                  </Text>
                  <Text>Телефон: {user.phone_number}</Text>
                  <Text style={[styles.status, getStatusColor(item.status)]}>
                    Статус: {item.status}
                  </Text>
                </>
              ) : (
                <Text>Загрузка данных пользователя...</Text>
              )}
            </View>
          )}
        />
      ) : (
        <Text style={styles.noAppointments}>Записей пока нет</Text>
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
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    marginRight: 20,
    flex: 1,
  },
  arrow_back: {
    width: 30,
    height: 30,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  noAppointments: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#777',
  },
});

export default Appointments;
