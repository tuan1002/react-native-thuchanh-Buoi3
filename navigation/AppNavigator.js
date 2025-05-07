import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
import MainTabs from './MainTabs'; // Đảm bảo rằng bạn đã import MainTabs

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Main" component={MainTabs} /> {/* Chuyển hướng đến MainTabs sau khi đăng nhập */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
