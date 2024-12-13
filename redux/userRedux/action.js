import { 
    FETCH_REQUEST,
    FETCH_SUCCESS,
    FETCH_ERROR,
    GET_USER_LIST,
    SET_USER_DATA
     } from '../constant'
  
  
  export function fetchRequest() {
    return {
      type: FETCH_REQUEST
    }
  }
  
  export function fetchSuccess(users) {
    return {
      type: FETCH_SUCCESS,
      data: users
    }
  }
  
  export function fetchError() {
    return {
      type: FETCH_ERROR
    }
  }
  
  
  // Trigger saga to fetch user data
  export function getUserList() {
    return {
      type: GET_USER_LIST,
    };
  }
  
  // Action to set user data in the reducer
  export function setUserData(users) {
    return {
      type: SET_USER_DATA,
      data: users,
    };
  }
  
  