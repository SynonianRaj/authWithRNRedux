import {
  CONNECTION_ERROR,
  CONNECTION_ESTABLISHED,
  RECEIVE_MESSAGE,
  DISCONNECT,
  CONNECT,
} from '../constant';

const initialStateForChat = {
  connected: false,
  messages: [], // Holds chat messages
  error: null, // Holds connection error
};

export const chatReducer = (state = initialStateForChat, action) => {
  console.log("Reducer received action: ", action); // Log all actions


  switch (action.type) {
    case CONNECT:

      return { ...state, connected: true, error: null };

    case CONNECTION_ERROR:
      return { ...state, connected: false, error: action.payload };

    case RECEIVE_MESSAGE:
      console.log("receved reducer messages --------> ", action.payload)
      return {
        ...state,
        messages: [...state.messages, ...action.payload], // Fix to access nested payload.message
      };

    case DISCONNECT:

      return { ...state, connected: false };

    default:
      return state;
  }
};


