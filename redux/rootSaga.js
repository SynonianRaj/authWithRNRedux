import { all } from 'redux-saga/effects';
// import authSaga from './authSaga';
import chatSaga from './chatRedux/saga';
import userSaga from './userRedux/saga';

export default function* rootSaga() {
  yield all([
    chatSaga(),
    userSaga(),
  ]);
}