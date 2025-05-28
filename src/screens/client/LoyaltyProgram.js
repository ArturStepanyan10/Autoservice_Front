import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import {API_URL} from '../../config/apiConfig';

const LoyaltyProgram = () => {
  const [bonusPoints, setBonusPoints] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [groupedTransactions, setGroupedTransactions] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoyaltyData = async () => {
      try {
        const [profileRes, transactionsRes] = await Promise.all([
          axios.get(`${API_URL}/api-loyalty-program/loyalty/profile/`),
          axios.get(`${API_URL}/api-loyalty-program/loyalty/history/`),
        ]);
        setBonusPoints(profileRes.data.bonus_points);
        setTransactions(transactionsRes.data);
        groupByDate(transactionsRes.data);
      } catch (error) {
        console.error('Ошибка при загрузке бонусов:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoyaltyData();
  }, []);

  const groupByDate = data => {
    const grouped = {};
    data.forEach(item => {
      const date = new Date(item.timestamp).toISOString().split('T')[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(item);
    });
    setGroupedTransactions(grouped);
  };

  if (loading) {
    return <ActivityIndicator style={{flex: 1}} size="large" color="#000" />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.bonusLabel}>Ваши бонусы:</Text>
        <Text style={styles.bonusPoints}>{bonusPoints ?? 0} баллов</Text>
      </View>

      <Text style={styles.sectionTitle}>История операций:</Text>
      {Object.keys(groupedTransactions).length === 0 ? (
        <Text style={styles.emptyText}>История операций пока отсутствует.</Text>
      ) : (
        Object.entries(groupedTransactions).map(([date, operations]) => (
          <View key={date} style={styles.dateGroup}>
            <Text style={styles.dateLabel}>{date}</Text>
            {operations.map((op, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.service}>{op.service}</Text>
                <Text
                  style={[
                    styles.points,
                    {color: op.points >= 0 ? '#2e7d32' : '#c62828'},
                  ]}>
                  {op.points >= 0 ? `+${op.points}` : op.points} баллов
                </Text>
              </View>
            ))}
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default LoyaltyProgram;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  bonusLabel: {
    fontSize: 16,
    color: '#666',
  },
  bonusPoints: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#333',
  },
  dateLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
    marginLeft: 4,
  },
  dateGroup: {
    marginBottom: 16,
  },
  service: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  points: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
