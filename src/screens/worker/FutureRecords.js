import {Text, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import AppointmentByWorkerFuture from '../../API/GET/AppointmentByWorkerFuture';
import {FlatList} from 'react-native-gesture-handler';

function FutureRecords() {
  const [appointments, setAppointments] = useState([]);

  return (
    <View style={styles.container}>
      <AppointmentByWorkerFuture setAppointments={setAppointments} />
      {appointments.length > 0 ? (
        <FlatList
          data={appointments}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={({item}) => (
            <View>
              <Text>{item.service}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noAppointments}>
          На ближайшее будущее записей нет
        </Text>
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

export default FutureRecords;
