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
            Home: focused ? 'home' : 'home-outline',
            Search: focused ? 'search' : 'search-outline',
            Garages: focused ? 'car' : 'car-outline',
            Bookings: focused ? 'calendar' : 'calendar-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Garages" component={GaragesScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Bookings">
        {() => <BookingsScreen user={user} />}
      </Tab.Screen>
      <Tab.Screen name="Profile">
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
      Alert.alert('Push Token', token.data);
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
        <Stack.Screen name="Booking">
           {(props) => <BookingScreen {...props} user={user} />}
         </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  ); 
}