import {
    CONNECT,
    DISCONNECT,
    SEND_MESSAGE,
    RECEIVE_MESSAGE,
    CONNECTION_ERROR,
    CONNECTION_ESTABLISHED,
  } from '../constant';
  
  export const connectWebSocket = (receiverId) => {
    return ({
    type: CONNECT,
    payload: { receiverId },
  });}
  
  export const disconnectWebSocket = () => ({
    type: DISCONNECT,
  });
  
  export const sendMessage = (message) => {
    console.log("sendddddinggg ->", message)
    return {
    type: SEND_MESSAGE,
    payload: message,
  }}
  
  export const receiveMessage = (message) => {
    // console.log("RECEIVED MESSAGE ACTION DISPATCHED ---->", message); // Log here
    return {
      type: RECEIVE_MESSAGE,
      payload: message,
    };
  };
  

  // export const connectionEstablished = () => ({
  //   type: CONNECTION_ESTABLISHED,
  // });
  
  export const connectionError = (error) => ({
    type: CONNECTION_ERROR,
    payload: error,
  });
  