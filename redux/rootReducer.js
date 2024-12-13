
import { combineReducers } from 'redux';
import {profileReducer} from './profileDetailRedux/reducer'
import {userReducer} from './userRedux/reducer'
import {chatReducer} from './chatRedux/reducer';
import {audioReducer} from './AudioRedux/audioReducer'
export default combineReducers({
  profile: profileReducer,
  user: userReducer,
  chat: chatReducer,
  audio: audioReducer,
});