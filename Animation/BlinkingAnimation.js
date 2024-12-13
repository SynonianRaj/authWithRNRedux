import React, { useState, useEffect } from 'react';
import { Animated, Text,StyleSheet, View } from 'react-native';

const BlinkingAnimation = () => {
  const [fadeAnim] = useState(new Animated.Value(1)); // Initial opacity is 1

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[styles.blinkingView, { opacity: fadeAnim }]}
    >

     </Animated.View>
  );
};

const styles = StyleSheet.create({
  blinkingView: {
    width: 20,
    height: 20,
    backgroundColor: 'red',
    borderRadius:10,
    marginVertical:"auto"
  },
});

export default BlinkingAnimation;