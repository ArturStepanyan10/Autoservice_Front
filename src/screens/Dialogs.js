import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import axios from '../config/axiosConfig';
import {API_URL} from '../config/apiConfig';

function Dialogs({navigation}) {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(`${API_URL}/api-chat/conversations/`);
        setConversations(response.data);
        console.log('Разговоры:', response.data);
      } catch (error) {
        console.error('Ошибка при загрузке разговоров:', error);
      }
    };

    fetchConversations();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate('Chat', {conversationId: item.id})
            }>
            <Text style={styles.title}>{item.receiver}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  card: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Dialogs;
