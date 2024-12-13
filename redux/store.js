import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
import createSagaMiddleware from 'redux-saga'
import rootSaga from './rootSaga'
import { persistReducer,persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const sagaMiddleware = createSagaMiddleware()


const persistConfig = {
  key: 'root', // The key to store the state in AsyncStorage
  storage: AsyncStorage, // Use AsyncStorage for persistent storage
  whitelist: ['accessToken','refreshToken']
};

// Wrap your rootReducer with persistReducer to add persistence functionality
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer:persistedReducer,
  middleware: () => [sagaMiddleware]
})

sagaMiddleware.run(rootSaga);
const persistor = persistStore(store);

export { store, persistor };


// const store = configureStore({
//   reducer:rootReducer,
//   middleware: () => [sagaMiddleware]

// })

// sagaMiddleware.run(rootSaga);

// export default store;