import React from 'react';
import { View, Button, Alert, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native'; // Sử dụng useNavigation

export default function Setting() {
  const navigation = useNavigation(); // Lấy navigation từ useNavigation

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.canGoBack('Login'); // Điều hướng về màn hình Login sau khi đăng xuất
      })
      .catch(error => {
        Alert.alert('Lỗi', error.message); // Hiển thị thông báo lỗi nếu đăng xuất không thành công
      });
  };

  return (
    <View style={styles.container}>
      <Button title="Đăng xuất" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
