import {
    FETCH_REQUEST,
    FETCH_SUCCESS,
    FETCH_ERROR,
    SET_USER_DATA,
    GET_USER_LIST,
  } from '../constant';
  
  const initialStateForUsers = {
    loading: false,
    users: [],
    error: false,
  };
  
  export const userReducer = (state = initialStateForUsers, action) => {
    switch (action.type) {
      case FETCH_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case FETCH_ERROR:
        return {
          ...state,
          loading: false,
          error: true,
        };
      case FETCH_SUCCESS:
        return {
          ...state,
          loading: false,
          users: action.data,
        };
  
      case SET_USER_DATA:
        return {
          ...state,
          loading: false,
          users: action.data,
          error: false,
        };
      default:
        return state;
    }
  };
  