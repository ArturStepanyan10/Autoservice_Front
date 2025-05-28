import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import axios from '../config/axiosConfig';
import {API_URL} from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

function Dialogs({navigation}) {
  const [conversations, setConversations] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = await AsyncStorage.getItem('access');
        if (token) {
          const decoded = jwtDecode(token);
          setUserId(decoded.user_id);

          const response = await axios.get(
            `${API_URL}/api-chat/conversations/`,
          );
          setConversations(response.data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке разговоров:', error);
      }
    };

    fetchConversations();
  }, []);

  if (!userId) {
    return (
      <View style={styles.centered}>
        <Text style={styles.infoText}>
          Пожалуйста, авторизуйтесь, чтобы увидеть диалоги
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.buttonAuthorization}>Авторизоваться</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({item}) => {
    let name = '';
    if (item.sender && item.sender[2] !== userId) {
      name = `${item.sender[1] || ''} ${item.sender[0] || ''}`.trim();
    } else if (item.receiver && item.receiver[2] !== userId) {
      name = `${item.receiver[1] || ''} ${item.receiver[0] || ''}`.trim();
    } else {
      name = 'Неизвестный';
    }

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate('Chat', {
            conversationId: item.id,
          })
        }>
        <Text style={styles.name}>{name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoText: {
    marginBottom: 16,
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  buttonAuthorization: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    color: '#fff',
    fontSize: 17,
  },
});

export default Dialogs;
