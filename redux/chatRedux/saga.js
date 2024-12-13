
import { eventChannel } from 'redux-saga';
import { takeEvery, put, call, take } from 'redux-saga/effects';
import webSocketService from '../../utils/WebSocketService';
import { RECEIVE_MESSAGE, CONNECT, DISCONNECT, SEND_MESSAGE } from '../constant';
import { receiveMessage } from './action';

// Create a channel for WebSocket messages
function createWebSocketChannel(socketService) {
  return eventChannel((emit) => {
    socketService.onMessage((message) => {
      console.log("Message from server:", message);
      emit(message);
    });

    // Return an unsubscribe function (no-op for WebSocket here)
    return () => { };
  });
}

// Saga: Connect to WebSocket
function* connectWebSocketSaga(action) {
  try {
    const { receiverId } = action.payload;

    // Connect to WebSocket
    yield call([webSocketService, webSocketService.connect], receiverId);

    // Create a WebSocket channel
    const channel = yield call(createWebSocketChannel, webSocketService);

    // Listen for messages from the channel
    while (true) {
      const message = yield take(channel);
        console.log("New messaged comed from server -> ", message);
      if (message.data.messages) {
        yield put(receiveMessage(message.data.messages));
      } else {
        console.log("No new messages received, skipping dispatch.");
      }
    }
  } catch (error) {
    console.error('Error connecting WebSocket:', error);
  }
}


// Saga: Disconnect WebSocket
function* disconnectWebSocketSaga() {
  try {
    yield call([webSocketService, webSocketService.disconnect]);
  } catch (error) {
    console.error('Error disconnecting WebSocket:', error);
  }
}

// Saga: Send Message
function* sendMessageSaga(action) {
  try {
    const message = action.payload;
    if (message) {
      console.log('send saga ->', message);
      yield call([webSocketService, webSocketService.send], message);
    }
  } catch (error) {
    console.error('Error sending WebSocket message:', error);
  }
}

// Root Saga
export default function* chatSaga() {
  yield takeEvery(CONNECT, connectWebSocketSaga);
  yield takeEvery(DISCONNECT, disconnectWebSocketSaga);
  yield takeEvery(SEND_MESSAGE, sendMessageSaga);
}
