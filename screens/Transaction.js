// src/screens/Transaction.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

export default function Transaction() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('transactions')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(data);
      });

    return () => unsubscribe();
  }, []);

  const renderTransaction = ({ item }) => (
    <Card style={styles.card} key={item.id}>
      <Card.Content>
        <Title>{item.customerName}</Title>
        <Paragraph>Dịch vụ: {item.serviceName}</Paragraph>
        <Paragraph>Giá: {item.price} VND</Paragraph>
        <Paragraph>Ngày: {item.date}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Danh sách giao dịch</Text>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    marginBottom: 12,
    backgroundColor: '#f8f8f8',
  },
});
