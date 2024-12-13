import { StyleSheet } from 'react-native'
import React, { useEffect, } from 'react'

import ProfileScreen from './components/ProfileScreen';
import UserList from './components/UserList';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
// import ChatScreen from './components/ChatScreen';
import ChatScreen from './components/chatComponenet/ChatScreen';

import { NavigationContainer } from '@react-navigation/native';
import { Text,View, Button } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getAuthToken } from './utils/Storage';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthAction } from './redux/profileDetailRedux/action';
import SplashScreen from './components/SplashScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DocListScreen from './components/DocListScreen';

const Stack = createNativeStackNavigator();

const Tab = createBottomTabNavigator();

const TabThreeScreen = () => {
  return <Text>Tab Three Screen </Text>;
};


/*
const ChatScreen = ({ navigation }) => {
  // Function to handle "Mark chat unread" button press
  const markChatUnread = () => {
    // Set the tabBarBadge to null or hidden
    navigation.setOptions({
      tabBarBadge: null, // This will hide the badge
    });
  };
  return (
    <View>
      <Text>Hiii, ChatScreen </Text>
      <Button title="Mark chat unread" onPress={markChatUnread} />
    </View>
  );
};
*/

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6200EE', // Color for active tab icon
        tabBarInactiveTintColor: 'gray', // Color for inactive tab icon
      }}>
      <Tab.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} /> // Home icon
          ),
        }}
      />
      <Tab.Screen
        name="Profile" // Fixed typo: 'Profie' -> 'Profile'
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} /> // Home icon
          ),
        }}
      />

      <Tab.Screen
        name="DocList"
        component={DocListScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" color={color} size={size} /> // Home icon
          ),
        }}
      />
      <Tab.Screen
        name="chat"
        component={ChatScreen}
        options={{
          tabBarBadge: 0,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbox" color={color} size={size} /> // Home icon
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const profileData = useSelector((state) => state.profile);
  const isLoggedIn = profileData.isLoggedIn;
  const isLoading = profileData.loading;
  console.log(profileData)
  console.log("Hii, from App")
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const { accessToken, refreshToken } = await getAuthToken();
        if (accessToken) {
          console.log('Access token found:', accessToken);
          dispatch(setAuthAction({ accessToken, refreshToken }));
        } else {
          console.log('No access token found');
          dispatch(setAuthAction({ accessToken, refreshToken }));
        }
      } catch (error) {
        console.error('Error fetching tokens:', error);
        dispatch(setAuthAction({ accessToken: null, refreshToken: null }));
      }
    };

    fetchTokens();
  }, [isLoading]);



  if (isLoading) {
    return (<SplashScreen />)
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Home" component={HomeTabs} />
            {/* <Stack.Screen name="UserList" component={UserList} />
            <Stack.Screen name="UserDetails" component={UserDetails} /> */}
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );



}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
});