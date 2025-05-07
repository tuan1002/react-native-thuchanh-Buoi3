import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, IconButton, TextInput, Button, Dialog, Portal } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';

export default function Home() {
  const [services, setServices] = useState([]);
  const [addVisible, setAddVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);

  const [newService, setNewService] = useState({ name: '', price: '', description: '' });
  const [editingService, setEditingService] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('services')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(data);
      });

    return () => unsubscribe();
  }, []);

  const addService = () => {
    const { name, price, description } = newService;
    if (!name || !price) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên và giá.');
      return;
    }

    firestore()
      .collection('services')
      .add({ name, price, description: description || '' })
      .then(() => {
        setNewService({ name: '', price: '', description: '' });
        setAddVisible(false);
      })
      .catch(err => {
        console.error('Lỗi thêm dịch vụ:', err);
        Alert.alert('Lỗi', 'Không thể thêm dịch vụ.');
      });
  };

  const updateService = () => {
    const { name, price, description, id } = editingService;
    if (!name || !price) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên và giá.');
      return;
    }

    firestore()
      .collection('services')
      .doc(id)
      .update({ name, price, description: description || '' })
      .then(() => {
        setEditingService(null);
        setEditVisible(false);
      })
      .catch(err => {
        console.error('Lỗi cập nhật:', err);
        Alert.alert('Lỗi', 'Không thể cập nhật dịch vụ.');
      });
  };

  const deleteService = (id) => {
    firestore()
      .collection('services')
      .doc(id)
      .delete()
      .catch(err => {
        console.error('Lỗi xóa dịch vụ:', err);
        Alert.alert('Lỗi', 'Không thể xóa dịch vụ.');
      });
  };

  const confirmDelete = (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa?', [
      { text: 'Hủy', style: 'cancel' },
      { text: 'Xóa', onPress: () => deleteService(id), style: 'destructive' },
    ]);
  };

  const renderService = ({ item }) => {
    const renderRightActions = () => (
      <View style={styles.deleteButtonWrapper}>
        <Button mode="contained" buttonColor="red" onPress={() => confirmDelete(item.id)}>
          Xóa
        </Button>
        <IconButton
          icon="pencil"
          size={30}
          onPress={() => {
            setEditingService(item);
            setEditVisible(true);
          }}
        />
      </View>
    );

    return (
      <Swipeable renderRightActions={renderRightActions}>
        <TouchableOpacity onPress={() => {
          setSelectedService(item);
          setDetailVisible(true);
        }}>
          <Card style={styles.card}>
            <Card.Content>
              <Title>{item.name}</Title>
              <Paragraph>Giá: {item.price} VND</Paragraph>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>Danh sách dịch vụ</Text>
          <IconButton icon="plus" size={30} onPress={() => setAddVisible(true)} />
        </View>

        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          renderItem={renderService}
          contentContainerStyle={styles.list}
        />

        {/* Dialog Thêm */}
        <Portal>
          <Dialog visible={addVisible} onDismiss={() => setAddVisible(false)}>
            <Dialog.Title>Thêm dịch vụ</Dialog.Title>
            <Dialog.Content>
              <TextInput label="Tên" value={newService.name} onChangeText={text => setNewService(prev => ({ ...prev, name: text }))} />
              <TextInput label="Giá" value={newService.price} keyboardType="numeric" onChangeText={text => setNewService(prev => ({ ...prev, price: text }))} />
              <TextInput label="Mô tả" value={newService.description} onChangeText={text => setNewService(prev => ({ ...prev, description: text }))} />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setAddVisible(false)}>Hủy</Button>
              <Button onPress={addService}>Thêm</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* Dialog Sửa */}
        <Portal>
          <Dialog visible={editVisible} onDismiss={() => setEditVisible(false)}>
            <Dialog.Title>Cập nhật dịch vụ</Dialog.Title>
            <Dialog.Content>
              <TextInput label="Tên" value={editingService?.name} onChangeText={text => setEditingService(prev => ({ ...prev, name: text }))} />
              <TextInput label="Giá" value={editingService?.price} keyboardType="numeric" onChangeText={text => setEditingService(prev => ({ ...prev, price: text }))} />
              <TextInput label="Mô tả" value={editingService?.description} onChangeText={text => setEditingService(prev => ({ ...prev, description: text }))} />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setEditVisible(false)}>Hủy</Button>
              <Button onPress={updateService}>Cập nhật</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {/* Dialog Chi tiết */}
        <Portal>
          <Dialog visible={detailVisible} onDismiss={() => setDetailVisible(false)}>
            <Dialog.Title>Chi tiết dịch vụ</Dialog.Title>
            <Dialog.Content>
              <Text>Tên: {selectedService?.name}</Text>
              <Text>Giá: {selectedService?.price} VND</Text>
              {selectedService?.description ? <Text>Mô tả: {selectedService.description}</Text> : null}
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setDetailVisible(false)}>Đóng</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heading: { fontSize: 22, fontWeight: 'bold' },
  list: { paddingTop: 16 },
  card: { marginBottom: 8, backgroundColor: '#f8f8f8', borderRadius: 8 },
  deleteButtonWrapper: { justifyContent: 'center', alignItems: 'center', width: 100, backgroundColor: 'white' },
});
