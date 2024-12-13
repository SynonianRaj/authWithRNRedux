import {

    GET_USER_PROFILE_DATA,
    SET_USER_PROFILE_DATA,
    SET_TOKEN,
    GET_TOKEN,
    DELETE_TOKEN,
    LOGOUT,

} from '../constant'


export const getUserProfileData = () => {
    return {
        type: GET_USER_PROFILE_DATA
    }
}
export const setUserProfileData = (data) => {
    return {
        type: SET_USER_PROFILE_DATA,
        payload: data
    }
}

export const setAuthAction = (token) => {
    return {
        type: SET_TOKEN,
        payload: token
    }

}

export const getTokenAction = () => {
    return {
        type: GET_TOKEN
    }
}


export const logOutAction = () => {
    return {
        type: LOGOUT,
    }
}