import { isTokenExpired } from "../../utils/Storage";
import {
    SET_USER_PROFILE_DATA,
    GET_USER_PROFILE_DATA,
    GET_TOKEN,
    SET_TOKEN,
    DELETE_TOKEN,
    LOGOUT,
} from "../constant";

const initialStateForProfile = {
    loading: true,
    isLoggedIn: null,
    accessToken: null,
    refreshToken: null,
    userProfileData: null,
};

export const profileReducer = (state = initialStateForProfile, action) => {
    switch (action.type) {
        case GET_USER_PROFILE_DATA:
            return {
                ...state,
                profile: state.userProfileData
            };
        case SET_USER_PROFILE_DATA:
            return {
                ...state,
                userProfileData: action.payload
            };
        case GET_TOKEN:
            return {
                ...state,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken
            };
        case SET_TOKEN:
            return {
                ...state,
                loading: false,
                isLoggedIn: !isTokenExpired(action.payload.accessToken),
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken
            };
        case LOGOUT:
            return {
                ...initialStateForProfile,
                loading: false, // Set explicitly to false if you don’t want loading post-logout
            };
        default:
            return state
    }
}



export default profileReducer;


// OPtimizeed reducer by chatgpt
/*

import { isTokenExpired } from "../../components/Storage";
import {
    SET_USER_PROFILE_DATA,
    GET_USER_PROFILE_DATA,
    GET_TOKEN,
    SET_TOKEN,
    DELETE_TOKEN,
    LOGOUT,
} from "../constant";

const initialStateForProfile = {
    loading: true,           // Indicates data loading state
    isLoggedIn: null,        // Tracks user login state
    accessToken: null,       // JWT access token
    refreshToken: null,      // JWT refresh token
    userProfileData: null,   // User profile information
};

export const profileReducer = (state = initialStateForProfile, action) => {
    switch (action.type) {
        case GET_USER_PROFILE_DATA:
            // Retrieve user profile data
            return {
                ...state,
                loading: false,
            };

        case SET_USER_PROFILE_DATA:
            // Update user profile data
            return {
                ...state,
                userProfileData: action.payload,
                loading: false,
            };

        case GET_TOKEN:
            // Token state remains unchanged; no need to duplicate it
            return state;

        case SET_TOKEN:
            // Set access and refresh tokens, and determine login state
            return {
                ...state,
                loading: false,
                isLoggedIn: !isTokenExpired(action.payload.accessToken),
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
            };

        case DELETE_TOKEN:
            // Clear only token-related fields
            return {
                ...state,
                accessToken: null,
                refreshToken: null,
            };

        case LOGOUT:
            // Reset state to initial on logout
            return {
                ...initialStateForProfile,
                loading: false, // Set explicitly to false if you don’t want loading post-logout
            };

        default:
            // Return current state for unknown actions
            return state;
    }
};

export default profileReducer;

*/