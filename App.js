import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import SearchScreen from './screens/SearchScreen';
import BookingsScreen from './screens/BookingsScreen';
import ProfileScreen from './screens/ProfileScreen';
import GarageDetailScreen from './screens/GarageDetailScreen';
import BookingScreen from './screens/BookingScreen';
import AuthScreen from './screens/AuthScreen';
import * as Notifications from 'expo-notifications';
import GaragesScreen from './screens/GaragesScreen';
import BookingDetailScreen from './screens/BookingDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTabs({ user, onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopWidth: 0,
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color }) => {
          const icons = {
            Acasă: focused ? 'home' : 'home-outline',
            Garaje: focused ? 'car' : 'car-outline',
            Programări: focused ? 'calendar' : 'calendar-outline',
            Profil: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Acasă" component={HomeScreen} />
      <Tab.Screen name="Garaje" component={GaragesScreen} />
      <Tab.Screen name="Programări">
      {(props) => <BookingsScreen {...props} user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Profil">
        {() => <ProfileScreen user={user} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const handleLogin = (userData, accessToken) => {
    setUser(userData);
    setToken(accessToken);
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  const registerForPushNotifications = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied');
        return;
      }
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: '40d6af54-ebfb-4e53-98b9-a34c07541dfa'
      });
      console.log('Push token:', token.data);
      const pushToken = token.data;
      console.log('Push token:', pushToken);
      if (user?.id) {
        await fetch(
          `https://web-production-72bd.up.railway.app/users/${user.id}/push-token?push_token=${encodeURIComponent(pushToken)}`,
          { method: 'POST' }
        );
      }
    } catch (e) {
      Alert.alert('Error', e.message);
    }
  };

  useEffect(() => {
    if (user) registerForPushNotifications();
  }, [user]);

  if (!user) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main">
          {() => <HomeTabs user={user} onLogout={handleLogout} />}
        </Stack.Screen>
        <Stack.Screen name="GarageDetail" component={GarageDetailScreen} />
        <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
        <Stack.Screen name="Booking">
           {(props) => <BookingScreen {...props} user={user} />}
         </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  ); 
}