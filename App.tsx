import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Provider as PaperProvider } from 'react-native-paper'; // Import Provider từ react-native-paper

import Login from './screens/Login';
import Home from './screens/Home';
import Transaction from './screens/Transaction';
import Customer from './screens/Customer';
import Setting from './screens/Setting';

import auth from '@react-native-firebase/auth';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          switch (route.name) {
            case 'Home':
              iconName = 'home-outline';
              break;
            case 'Transaction':
              iconName = 'cash-multiple';
              break;
            case 'Customer':
              iconName = 'account-group';
              break;
            case 'Setting':
              iconName = 'cog-outline';
              break;
          }
          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Transaction" component={Transaction} />
      <Tab.Screen name="Customer" component={Customer} />
      <Tab.Screen name="Setting" component={Setting} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [initializing, setInitializing] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authUser) => {
      setUser(authUser);
      if (initializing) setInitializing(false);
    });

    return unsubscribe;
  }, [initializing]);

  if (initializing) return null;

  return (
    <PaperProvider> {/* Bọc ứng dụng bằng PaperProvider */}
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Đảm bảo rằng màn hình Login được khai báo trong Stack.Navigator */}
          {user ? (
            <Stack.Screen name="Home" component={MainTabs} />
          ) : (
            <Stack.Screen name="Login" component={Login} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
