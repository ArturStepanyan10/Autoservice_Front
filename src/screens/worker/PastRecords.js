import {Text, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import AppointmentByWorkerFuture from '../../API/GET/AppointmentByWorkerPast';
import {FlatList} from 'react-native-gesture-handler';

function PastRecords() {
  const [appointments, setAppointments] = useState([]);

  return (
    <View style={styles.container}>
      <AppointmentByWorkerFuture setAppointments={setAppointments} />
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
        <Text style={styles.noAppointments}>У вас еще нет прошлых записей</Text>
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
  noAppointments: {
    fontSize: 18,
    color: 'gray',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default PastRecords;
