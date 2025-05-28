/* eslint-disable no-shadow */
/* eslint-disable eqeqeq */
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
import {jwtDecode} from 'jwt-decode';
import {format, parseISO, isToday, isYesterday} from 'date-fns';

const {width} = Dimensions.get('window');

const ChatScreen = ({route}) => {
  const {conversationId} = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const socketRef = useRef(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const getUserId = async () => {
      const token = await AsyncStorage.getItem('access');
      if (token) {
        const decoded = jwtDecode(token);
        setUserId(decoded.user_id);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initWebSocket = async () => {
      try {
        const token = await AsyncStorage.getItem('access');
        if (!token) {
          console.warn('Токен не найден');
          return;
        }

        const socket = new WebSocket(
          `ws://${API_URL.replace(
            'http://',
            '',
          )}/ws/conversations/${conversationId}/?token=${token}`,
        );

        socket.onopen = () => {
          console.log('WebSocket подключён');
        };

        socket.onmessage = e => {
          const message = JSON.parse(e.data);
          if (isMounted) {
            setMessages(prev => [...prev, message]);
          }
        };

        socket.onerror = error => {
          console.log('Ошибка WebSocket:', error.message);
        };

        socket.onclose = () => {
          console.log('WebSocket отключён');
        };

        socketRef.current = socket;
      } catch (error) {
        console.error('Ошибка при инициализации WebSocket:', error);
      }
    };

    initWebSocket();

    return () => {
      isMounted = false;
      socketRef.current?.close();
    };
  }, [conversationId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api-chat/messages/?conversation=${conversationId}`,
        );
        setMessages(response.data);
      } catch (error) {
        console.error('Ошибка при загрузке сообщений:', error);
      }
    };

    fetchMessages();
  }, [conversationId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const token = await AsyncStorage.getItem('access');

    const {user_id: sender} = jwtDecode(token);

    const payload = {
      action: 'send_message',
      message: newMessage,
      user_id: sender,
    };

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(payload));
      setNewMessage('');
    }
  };

  const groupMessagesByDate = messages => {
    const result = [];
    let lastDate = null;

    messages.forEach(msg => {
      if (!msg.created) return;
      const msgDate = parseISO(msg.created);
      const currentDateKey = format(msgDate, 'yyyy-MM-dd');

      if (lastDate !== currentDateKey) {
        let label = format(msgDate, 'd MMMM yyyy');

        if (isToday(msgDate)) label = 'Сегодня';
        else if (isYesterday(msgDate)) label = 'Вчера';

        result.push({type: 'date', label});
        lastDate = currentDateKey;
      }

      result.push({...msg, type: 'message'});
    });

    return result;
  };

  const renderItem = ({item}) => {
    if (item.type === 'date') {
      return (
        <View style={styles.dateSeparator}>
          <Text style={styles.dateText}>{item.label}</Text>
        </View>
      );
    }

    const isMine = item.user[2] === userId;
    const time = format(parseISO(item.created), 'HH:mm');

    return (
      <View
        style={[
          styles.bubble,
          isMine ? styles.myBubble : styles.theirBubble,
          {alignSelf: isMine ? 'flex-end' : 'flex-start'},
        ]}>
        <Text style={isMine ? styles.myText : styles.theirText}>
          {item.text}
        </Text>
        <Text style={styles.timestamp}>{time}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={groupMessagesByDate(messages)}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item.type === 'date' ? `date-${index}` : `msg-${item.id || index}`
        }
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Напишите сообщение..."
          placeholderTextColor="#ccc"
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
  dateSeparator: {
    alignSelf: 'center',
    backgroundColor: '#dcdcdc',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginVertical: 10,
  },
  dateText: {
    fontSize: 13,
    color: '#444',
  },
  timestamp: {
    fontSize: 10,
    color: '#ccc',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
});

export default ChatScreen;
