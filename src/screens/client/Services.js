import React, {useState} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import GetServices from '../../API/GET/GetServices';
import {useNavigation} from '@react-navigation/native';

function Services() {
  const navigation = useNavigation();
  const [services, setServices] = useState([]);

  const navigateToReviews = serviceId => {
    navigation.navigate('Reviews', {serviceId: serviceId});
  };

  return (
    <View style={styles.container}>
      <GetServices setServices={setServices} />

      {services.length > 0 ? (
        <FlatList
          data={services}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <View style={styles.serviceCard}>
              <Text style={styles.serviceTitle}>{item.title}</Text>
              <Text style={styles.serviceDescription}>{item.description}</Text>
              {item.price && (
                <View style={styles.priceBlock}>
                  <Text style={styles.servicePrice}>Цена: {item.price} ₽</Text>
                </View>
              )}
              <View style={styles.reviewCard}>
                <TouchableOpacity
                  style={styles.reviewButton}
                  onPress={() => navigateToReviews(item.id)}>
                  <Text style={styles.reviewButtonText}>Отзывы</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noServices}>
          Список услуг пуст или загружается...
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  serviceCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    position: 'relative',
  },
  reviewCard: {
    paddingBottom: 45,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    textAlign: 'justify',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  priceBlock: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    fontSize: 17,
    backgroundColor: '#1DC37E',
    borderWidth: 2,
    borderRadius: 8,
    padding: 5,
  },
  noServices: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#777',
  },
  reviewButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 5,
    left: 15,
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  reviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Services;
