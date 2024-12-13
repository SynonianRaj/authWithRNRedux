import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import CustomBubble from './CustomBubble';
import CustomInputToolbar from './CustomInputToolbar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as Animatable from 'react-native-animatable';
import {useDispatch, useSelector} from 'react-redux';
import RenderMessageAudio from './RenderMessageAudio'

import {
  connectWebSocket,
  disconnectWebSocket,
  sendMessage,
} from '../../redux/chatRedux/action';

import {v4 as uuidv4} from 'uuid';

const genRoom = (sender_id, receiver_id) =>
  `room_${Math.min(sender_id, receiver_id)}_${Math.max(
    sender_id,
    receiver_id,
  )}`;

const ChatScreen = ({route}) => {

  const {user} = route.params
  console.log("userssssssssss-> ", user)
  const {id, firstName, lastName, username} = useSelector(
    state => state.profile.userProfileData,
  );
  const receiverId = user.id; // Replace with the receiver's dynamic ID
  const currentUserId = id;
  const currentUserName = username;
  const dispatch = useDispatch();

  // const storeData = useSelector((state) => state.chat.message)
  const messages = useSelector(state => state.chat.messages)
  .map(msg => ({
    _id: uuidv4(), // Ensure a unique ID for each message
    text: msg.type === 'text' ? msg.content : undefined, // Text message content
    image: msg.type === 'image' ? msg.content : undefined, // Image URL
    audio: msg.type === 'audio' ? msg.content : undefined, // Audio URL
    video: msg.type === 'video' ? msg.content : undefined, // Video URL
    duration : (msg.type === 'audio' || msg.type === 'video') ? msg.duration: undefined,
    createdAt: new Date(msg.timestamp), // Convert timestamp to Date object
    user: {
      _id: msg.sender_id, // Sender's user ID
      name: msg.sender_name || 'Anonymous', // Fallback name
      avatar: msg.sender_avatar || undefined, // Optional: Sender avatar
    },
  }))
  .reverse();



    // Handle WebSocket connection on mount/unmount
    useEffect(() => {
      checkPermission() //check for permissions
      dispatch(connectWebSocket(genRoom(currentUserId, receiverId)));
      
      return () => {
        dispatch(disconnectWebSocket());
      };
    }, [dispatch, receiverId]);
  

  const checkPermission = async () => {
    const permission =
      Platform.OS === 'android' ? permission.ANDROID.RECORD_AUDIO: permission.IOS.MICROPHONE;

    const result = await check(permission);
    
    if (result !== result.GRANTED) {
      const requestResult = await request(permission);
      if (requestResult !== result.GRANTED) {
        Alert.alert('Permission Denied', 'Audio recording permission is required.');
        return;
      }
    }
  };



  const onSend = useCallback(
    (newMessages = []) => {
      if (newMessages.length > 0) {
        const message = newMessages[0]; // GiftedChat sends an array of messages
        dispatch(
          sendMessage({
            message_type:"text",
            content: message.text, // The actual message content
            timestamp: new Date().toISOString(), // Current timestamp
            sender_id: currentUserId, // Current user's ID
            receiver_id: receiverId, // Receiver's ID
            duration: undefined,

          }),
        );
      }
    },
    [dispatch, receiverId, currentUserId, currentUserName],
  );


  const handleImageUpload = () => {
    console.log('Image Upload Triggered!');
  };

  const handleAttachment = () => {
    console.log('Attachment Triggered!');
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <Animatable.View
        animation="fadeInUp"
        duration={500}
        style={styles.animatableContainer}>
        <GiftedChat
          messages={messages}
          onSend={messages => onSend(messages)}
          user={{
            _id: 1,
          }}
          renderBubble={props => <CustomBubble {...props} />}
          renderInputToolbar={props => (
            <CustomInputToolbar
              {...props}
              onImageUpload={handleImageUpload}
              onAttachment={handleAttachment}
              receiverId = {receiverId}
              
            />
          )}
          renderMessageAudio = {props => <RenderMessageAudio {...props} />}
          showUserAvatar={false}
          alwaysShowSend={false}
          scrollToBottom
        />
      </Animatable.View>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  animatableContainer: {
    flex: 1,
  },
});

export default ChatScreen;

