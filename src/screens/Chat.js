import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  Button,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {API_URL} from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../config/axiosConfig';
import jwtDecode from 'jwt-decode';

const {width} = Dimensions.get('window');

const ChatScreen = ({route}) => {
  const {conversationId} = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [myId, setMyId] = useState(null);
  const socketRef = useRef(null);

  // достаём свой user_id из токена
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('access');
      if (token) {
        const {user_id} = jwtDecode(token);
        setMyId(user_id);
      }
    })();
  }, []);

  // WS
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const token = await AsyncStorage.getItem('access');
      if (!token) return;
      const socket = new WebSocket(
        `ws://${API_URL.replace(
          'http://',
          '',
        )}/ws/conversations/${conversationId}/?token=${token}`,
      );
      socket.onmessage = e => {
        const msg = JSON.parse(e.data);
        if (isMounted) setMessages(prev => [...prev, msg]);
      };
      socketRef.current = socket;
      return () => {
        isMounted = false;
        socket.close();
      };
    })();
  }, [conversationId]);

  // REST-загрузка истории
  useEffect(() => {
    (async () => {
      const resp = await axios.get(
        `${API_URL}/api-chat/messages/?conversation=${conversationId}`,
      );
      setMessages(resp.data);
    })();
  }, [conversationId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || socketRef.current.readyState !== WebSocket.OPEN)
      return;
    const token = await AsyncStorage.getItem('access');
    const {user_id: sender} = jwtDecode(token);
    socketRef.current.send(
      JSON.stringify({
        action: 'send_message',
        message: newMessage,
        user_id: sender,
      }),
    );
    setNewMessage('');
  };

  const renderItem = ({item}) => {
    const isMine = item.user === myId;
    return (
      <View
        style={[
          styles.bubble,
          isMine ? styles.myBubble : styles.theirBubble,
          {alignSelf: isMine ? 'flex-end' : 'flex-start'},
        ]}>
        <Text style={isMine ? styles.myText : styles.theirText}>
          {item.user} : {item.text}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, i) => i.toString()}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Напишите сообщение..."
        />
        <Button title="➤" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#eef2f5'},
  chatContainer: {padding: 10},
  bubble: {
    maxWidth: width * 0.7,
    padding: 10,
    marginVertical: 4,
    borderRadius: 20,
  },
  myBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 2,
    borderBottomLeftRadius: 20,
  },
  theirBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 20,
  },
  myText: {
    color: '#fff',
  },
  theirText: {
    color: '#000',
  },
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    marginRight: 8,
  },
});

export default ChatScreen;
