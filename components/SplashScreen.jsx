// SplashScreen.js
import React from 'react';

import { getAuthToken } from '../utils/Storage';


import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { setAuthAction } from '../redux/profileDetailRedux/action';
import { useDispatch } from 'react-redux';

const SplashScreen = () => {
  console.log("Hii!, From Splash")
 

  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#fff" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
  text: {
    marginTop: 10,
    fontSize: 18,
    color: '#fff',
  },
});

export default SplashScreen;
