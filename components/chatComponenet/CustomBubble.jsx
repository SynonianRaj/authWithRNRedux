import React from 'react';
import { View, StyleSheet, Text} from 'react-native';

import { Bubble } from 'react-native-gifted-chat';

const CustomBubble = props => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        left: {
          backgroundColor: '#e0e0e0',
        },
        right: {
          backgroundColor: '#4a90e2',
          
        },
      }}
      textStyle={{
        left: {
          color: '#333',
        },
        right: {
          color: '#fff',
        },
      }}
      renderCustomView={() => (
        <View style={styles.customView}>
          {/* Custom content like buttons or images */}
        
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  // customView: {
  //   padding: 4,
  //   backgroundColor: '#f0f0f0',
  //   borderRadius: 4,
  // },
});

export default CustomBubble;
