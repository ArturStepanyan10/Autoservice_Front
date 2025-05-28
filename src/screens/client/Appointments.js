import React, {useEffect, useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import axios from '../../config/axiosConfig';
import UserInfo from '../../API/GET/UserInfo';
import {useNavigation} from '@react-navigation/native';
import GetServices from '../../API/GET/GetServices';
import {API_URL} from '../../config/apiConfig';

function Appointments() {
  const [appointment, setAppointment] = useState([]);
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api-base/appointmentlist/`,
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
        return {fontWeight: 'bold', color: 'green'};
      case 'В ПРОЦЕССЕ':
        return {fontWeight: 'bold', color: 'orange'};
      case 'ЗАВЕРШЕНА':
        return {fontWeight: 'bold', color: 'blue'};
      default:
        return {fontWeight: 'bold', color: 'gray'};
    }
  };

  const isPastAppointment = (date, time) => {
    try {
      const appointmentDateTime = new Date(`${date}T${time}`);
      const now = new Date();
      return appointmentDateTime < now;
    } catch (error) {
      console.log('Ошибка при проверке времени:', error);
      return false;
    }
  };

  const createOrGetConversation = async workerId => {
    try {
      const response = await axios.post(`${API_URL}/api-chat/conversations/`, {
        receiver: workerId[0],
      });
      const conversationId = response.data.conversation_id;
      navigation.navigate('Chat', {conversationId});
    } catch (error) {
      console.log('Ошибка при создании или получении чата:', error);
    }
  };

  const handleWorkerPress = workerId => {
    if (workerId) {
      createOrGetConversation(workerId);
    }
  };

  const confirmCancel = (appointmentId, disabled) => {
    if (disabled) return;

    Alert.alert(
      'Отмена записи',
      'Вы уверены, что хотите отменить эту запись?',
      [
        {
          text: 'Нет',
          style: 'cancel',
        },
        {
          text: 'Да',
          onPress: () => cancelAppointment(appointmentId),
          style: 'destructive',
        },
      ],
    );
  };

  const cancelAppointment = async id => {
    try {
      await axios.delete(`${API_URL}/api-base/appointments/${id}/`);
      console.log('Запись успешно отменена:', id);

      setAppointment(prevAppointments =>
        prevAppointments.filter(app => app.id !== id),
      );
    } catch (error) {
      console.log('Ошибка при отмене записи:', error);
      Alert.alert(
        'Ошибка',
        'Не удалось отменить запись. Пожалуйста, попробуйте позже.',
      );
    }
  };

  return (
    <View style={styles.container}>
      <GetServices setServices={setServices} />

      {appointment.length > 0 ? (
        <FlatList
          data={appointment}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => {
            const disabled = isPastAppointment(item.date, item.time);

            return (
              <View style={styles.appointmentCard}>
                <UserInfo setUser={setUser} />
                {user ? (
                  <>
                    <Text style={styles.title}>{item.service}</Text>
                    <Text>Дата: {item.date}</Text>
                    <Text>Время: {item.time}</Text>
                    <Text>
                      Имя клиента: {user.first_name} {user.last_name}
                    </Text>
                    <Text>Телефон: {item.phone_number}</Text>

                    <View style={styles.workerContainer}>
                      {item.worker ? (
                        <TouchableOpacity
                          onPress={() => handleWorkerPress(item.worker[0])}>
                          <Text style={styles.workerLabel}>
                            Мастер: {item.worker[1]} {item.worker[2]}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.workerPending}>
                          Мастер пока не назначен
                        </Text>
                      )}
                    </View>

                    <Text style={[styles.status, getStatusColor(item.status)]}>
                      Статус: {item.status}
                    </Text>

                    <TouchableOpacity
                      style={[
                        styles.cancelButton,
                        disabled && {backgroundColor: '#ccc'},
                      ]}
                      onPress={() => confirmCancel(item.id, disabled)}
                      disabled={disabled}>
                      <Text
                        style={[
                          styles.cancelText,
                          disabled && {color: '#666'},
                        ]}>
                        Отменить запись
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <Text>Загрузка данных пользователя...</Text>
                )}
              </View>
            );
          }}
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
  cancelButton: {
    backgroundColor: '#E32636',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  workerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  workerLabel: {
    fontSize: 16,
    textDecorationLine: 'underline',
    color: '#1E90FF',
  },
  workerPending: {
    fontSize: 16,
    color: '#777',
    fontStyle: 'italic',
  },
  status: {
    marginTop: 5,
  },
});

export default Appointments;
