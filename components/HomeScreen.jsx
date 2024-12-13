import { Alert, Button, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logOutAction, setUserProfileData } from '../redux/profileDetailRedux/action';
import { removeAuthToken } from '../utils/Storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { TOKEN_EXPIRED } from '../redux/constant';
export default function HomeScreen({ navigation }) {
  const {accessToken, userProfileData} = useSelector((state) => state.profile)
  const dispatch = useDispatch();
  const { id = null, firstName = '', lastName = '' } = userProfileData || {};


  const handleLogOutBtn = async () => {
    // Alert.alert("msg", "Loggin Out");


    dispatch(logOutAction());
    await removeAuthToken();

  }

  useEffect(() => {
    console.log("from home ->", accessToken)
    const fetchStore = async () => {
      if (userProfileData === null) {
        try {
          const response = await axios.get('https://dummyjson.com/auth/me', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (response.status === 200) {
            // console.log('Response:', response.data);
            // When app restarts and have to fetch data using tokens from localStorage
            dispatch(setUserProfileData(response.data))

        
          }

        }
        catch (error) {
          console.log("error ->", error);
        }
      } else {
        console.log("from homescreen to check id or name ->", `Hii ${id} -> ${firstName} ${lastName}`);
        
        console.log("from homeScreen 3 ->", "user profile data found");
      }
    }

    fetchStore();

  }, [userProfileData])
  return (
    <View>
      <Text>HomeScreen</Text>
      <Button title="Go to details" onPress={() => { navigation.navigate('UserDetails') }} />
      <Button title='Log out' onPress={handleLogOutBtn} />
    </View>
  )
}

const styles = StyleSheet.create({})