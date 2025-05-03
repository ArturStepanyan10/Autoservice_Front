/* eslint-disable react/react-in-jsx-scope */
import {useState} from 'react';
import {Text, Image, View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import AppointmentByWorkerDate from '../../API/GET/AppointmentByWorkerDate';
import {FlatList} from 'react-native-gesture-handler';

function HomeWorker() {
  const navigation = useNavigation();
  const [appointments, setAppointments] = useState([]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
        />
        <View style={styles.headerContainer}>
          <Text style={styles.nameText}>АВТОМАСТЕР</Text>
          <Text style={styles.nameOrg}>АВТОСЕРВИС</Text>
        </View>
      </View>
      <View style={styles.PastFutureRecord}>
        <TouchableOpacity
          style={styles.recordBlock}
          onPress={() => navigation.navigate('PastRecords')}>
          <Text style={styles.recordText}>Прошлые записи</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.recordBlock}
          onPress={() => navigation.navigate('FutureRecords')}>
          <Text style={styles.recordText}>Будущие записи</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.TodayRecords}>Записи на сегодня</Text>
      <AppointmentByWorkerDate setAppointments={setAppointments} />
      {appointments.length > 0 ? (
        <FlatList
          data={appointments}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View>
              <Text>{item.date}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noAppointments}>Записей на сегодня нет</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    padding: 10,
    borderRadius: 8,
    width: 200,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
  },
  logo: {
    borderRadius: 20,
    width: 70,
    height: 70,
    marginRight: 10,
  },
  nameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  nameOrg: {
    fontSize: 13,
    textAlign: 'center',
    color: 'white',
  },
  PastFutureRecord: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  recordBlock: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  recordText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  TodayRecords: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 10,
  },
  noAppointments: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default HomeWorker;
