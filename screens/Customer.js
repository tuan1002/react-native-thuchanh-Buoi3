// src/screens/Customer.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Card, Title, Paragraph } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

export default function Customer() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('customers')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCustomers(data);
      });

    return () => unsubscribe();
  }, []);

  const renderCustomer = ({ item }) => (
    <Card style={styles.card} key={item.id}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>Email: {item.email}</Paragraph>
        <Paragraph>Số điện thoại: {item.phone}</Paragraph>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Danh sách khách hàng</Text>
      <FlatList
        data={customers}
        keyExtractor={item => item.id}
        renderItem={renderCustomer}
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
