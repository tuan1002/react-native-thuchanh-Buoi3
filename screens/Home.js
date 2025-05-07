import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, Card, Title, Paragraph, IconButton, TextInput, Button, Dialog, Portal } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

export default function Home() {
  const [services, setServices] = useState([]);
  const [visible, setVisible] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    price: '',
    description: '',
  });

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('services')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(data);
      });

    return () => unsubscribe();
  }, []);

  const deleteService = (id) => {
    firestore()
      .collection('services')
      .doc(id)
      .delete()
      .then(() => {
        console.log('Service deleted!');
      })
      .catch(error => {
        console.error('Error deleting service: ', error);
      });
  };

  const confirmDelete = (id) => {
    Alert.alert(
      "Xác nhận xóa dịch vụ",
      "Bạn có chắc chắn muốn xóa dịch vụ này không?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", onPress: () => deleteService(id), style: "destructive" }
      ]
    );
  };

  const addService = () => {
    const { name, price, description } = newService;

    if (!name || !price) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ tên và giá dịch vụ.');
      return;
    }

    firestore()
      .collection('services')
      .add({
        name,
        price,
        description: description || '',
      })
      .then(() => {
        setNewService({ name: '', price: '', description: '' });
        setVisible(false);
      })
      .catch((error) => {
        console.error('Error adding service: ', error);
      });
  };

  const renderService = ({ item }) => {
    const renderRightActions = () => (
      <View style={styles.deleteButtonWrapper}>
        <Button
          mode="contained"
          buttonColor="red"
          onPress={() => confirmDelete(item.id)}
        >
          <Text style={{ color: 'white' }}>Xóa</Text>
        </Button>
      </View>
    );

    return (
      <Swipeable renderRightActions={renderRightActions}>
        <Card style={styles.card} key={item.id}>
          <Card.Content style={styles.cardContent}>
            <Title>{item.name}</Title>
            <Paragraph>Giá: {item.price} VND</Paragraph>
            {item.description ? <Paragraph>{item.description}</Paragraph> : null}
          </Card.Content>
        </Card>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>Danh sách dịch vụ</Text>
          <IconButton
            icon="plus"
            size={30}
            onPress={() => setVisible(true)}
            style={styles.addButton}
          />
        </View>

        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={renderService}
          contentContainerStyle={styles.list}
        />

        <Portal>
          <Dialog visible={visible} onDismiss={() => setVisible(false)}>
            <Dialog.Title>Thêm dịch vụ mới</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Tên dịch vụ"
                value={newService.name}
                onChangeText={text => setNewService(prev => ({ ...prev, name: text }))}
                style={styles.input}
              />
              <TextInput
                label="Giá dịch vụ"
                value={newService.price}
                keyboardType="numeric"
                onChangeText={text => setNewService(prev => ({ ...prev, price: text }))}
                style={styles.input}
              />
              <TextInput
                label="Mô tả"
                value={newService.description}
                onChangeText={text => setNewService(prev => ({ ...prev, description: text }))}
                style={styles.input}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setVisible(false)}>Hủy</Button>
              <Button onPress={addService}>Thêm</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  addButton: {
    marginTop: 5,
  },
  list: {
    paddingBottom: 10,
  },
  card: {
    marginBottom: 8,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 8,
  },
  cardContent: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  input: {
    marginBottom: 12,
  },
  deleteButtonWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    height: '100%',
    width: 100,
    borderRadius: 8,
  },
});
