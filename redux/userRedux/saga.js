import { GET_USER_LIST, SET_USER_DATA, FETCH_REQUEST, FETCH_ERROR } from '../constant';
import { put, takeEvery } from 'redux-saga/effects';

const url = 'https://dummyjson.com/users';

// Worker saga: Fetches user data
function* fetchUser() {
  try {
    // Start fetch request
    yield put({ type: FETCH_REQUEST });

    // Fetch data from API
    const response = yield fetch(url);
    const dataItems = yield response.json();

    // Dispatch action to set user data in the reducer
    yield put({ type: SET_USER_DATA, data: dataItems.users});

  } catch (error) {
    console.error('Error fetching user data:', error);

    // Dispatch error action
    yield put({ type: FETCH_ERROR });
  }
}

// Watcher saga: Watches for GET_USER_LIST action
function* SagaData() {
  yield takeEvery(GET_USER_LIST, fetchUser);
}

export default SagaData;
