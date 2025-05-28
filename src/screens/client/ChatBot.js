import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import axios from '../../config/axiosConfig';
import {API_URL} from '../../config/apiConfig';

const {width} = Dimensions.get('window');

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Добавляем в чат своё сообщение
    const userMessage = {
      id: Date.now().toString(),
      text: input,
      isUser: true,
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Показываем «пузырёк» загрузки
    const loadingMessage = {
      id: 'loading',
      text: '',
      isUser: false,
      isLoading: true,
    };
    setMessages(prev => [...prev, loadingMessage]);

    try {
      const {data} = await axios.get(
        `${API_URL}/api-chatbot/faq-search/?q=${input}`,
      );

      // Убираем «пузырёк» загрузки
      setMessages(prev => prev.filter(m => m.id !== 'loading'));

      // Определяем текст ответа бота
      let botText = 'Нет ответа';
      if (Array.isArray(data)) {
        if (data.length > 0 && data[0].answer) {
          botText = data[0].answer;
        }
      } else if (data.answer) {
        botText = data.answer;
      } else if (data.error) {
        botText = data.error;
      }

      const botMessage = {
        id: Date.now().toString() + '-bot',
        text: botText,
        isUser: false,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.log('Ошибка запроса к боту:', error);
      // Убираем «пузырёк» загрузки
      setMessages(prev => prev.filter(m => m.id !== 'loading'));
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString() + '-err',
          text: 'Ошибка ответа от бота. Попробуйте позже.',
          isUser: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => {
    if (item.isLoading) {
      return (
        <View style={[styles.messageBubble, styles.loadingBubble]}>
          <ActivityIndicator size="small" />
        </View>
      );
    }

    return (
      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.botBubble,
        ]}>
        <Text style={item.isUser ? styles.userText : styles.botText}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ios: 'padding', android: undefined})}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Задайте вопрос..."
          placeholderTextColor="#888"
        />
        <Button
          title={loading ? '...' : '➤'}
          onPress={sendMessage}
          disabled={loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  chatContainer: {padding: 10},
  messageBubble: {
    maxWidth: width * 0.75,
    padding: 10,
    marginVertical: 6,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 2,
  },
  botBubble: {
    backgroundColor: '#e1e1e1',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 2,
  },
  loadingBubble: {
    backgroundColor: '#e1e1e1',
    alignSelf: 'flex-start',
  },
  userText: {color: '#fff'},
  botText: {color: '#000'},
  inputRow: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
});

export default ChatBot;
