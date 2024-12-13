import React, {useEffect, useCallback, useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  connectWebSocket,
  disconnectWebSocket,
  sendMessage,
} from '../redux/chatRedux/action';

import {v4 as uuidv4} from 'uuid';

const genRoom = (sender_id, receiver_id) =>
  `room_${Math.min(sender_id, receiver_id)}_${Math.max(
    sender_id,
    receiver_id,
  )}`;

export default function ChatScreen({route}) {
  const {user} = route.params
  console.log("userssssssssss-> ", user)
  const {id, firstName, lastName, username} = useSelector(
    state => state.profile.userProfileData,
  );
  const receiverId = user.id; // Replace with the receiver's dynamic ID
  const currentUserId = id;
  const currentUserName = username;
  const dispatch = useDispatch();

  // Retrieve and format messages from Redux store

  const messages = useSelector(state => state.chat.messages)
    .map(msg => ({
      _id: uuidv4(), // Ensure a unique ID for each message
      text: msg.message || '', // Message content
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
    dispatch(connectWebSocket(genRoom(currentUserId, receiverId)));

    return () => {
      dispatch(disconnectWebSocket());
    };
  }, [dispatch, receiverId]);

  // Handle sending a new message
  const onSend = useCallback(
    (newMessages = []) => {
      if (newMessages.length > 0) {
        const message = newMessages[0]; // GiftedChat sends an array of messages
        dispatch(
          sendMessage({
            content: message.text, // The actual message content
            timestamp: new Date().toISOString(), // Current timestamp
            sender_id: currentUserId, // Current user's ID
            sender_name: currentUserName, // Current user's name
            receiver_id: receiverId, // Receiver's ID
          }),
        );
      }
    },
    [dispatch, receiverId, currentUserId, currentUserName],
  );

  return (
    <GestureHandlerRootView>
      <GiftedChat
        messages={messages} // Pass formatted messages to GiftedChat
        onSend={newMessages => onSend(newMessages)} // Handle message sending
        user={{
          _id: currentUserId, // Replace with the current user's ID
          name: `${firstName} ${lastName}`,
        }}
        placeholder="Type a message..."
      />
    </GestureHandlerRootView>
  );
}
