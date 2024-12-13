import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";




export const isTokenExpired = (accessToken) => {
    if (!accessToken) {
        console.log("from storage -> ", "token is null");
        return true; // Assume expired if the token is null
    }
    try {
        const decoded = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000; // Current time in seconds
        console.log("is Token expired -> ", decoded.exp < currentTime);
        return decoded.exp < currentTime; // Returns true if expired
    } catch (error) {
        console.log("Invalid token -> ", error.message);
        return true; // Assume expired if the token is invalid
    }
};


export const setAuthToken = async (tokens) => {
    const { accessToken, refreshToken } = tokens;
    try {
        await AsyncStorage.setItem("accessToken", accessToken);
        await AsyncStorage.setItem("refreshToken", refreshToken);
        console.log('Saved  Token Success');
    }
    catch (error) {
        console.log(error);
    }

}


export const getAuthToken = async () => {
    try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        console.log('Retreived  Token Success');

        if (accessToken === null || refreshToken === null) {
            console.log('No token found');
            return { accessToken: null, refreshToken: null };
        }
        else if (await isTokenExpired(accessToken)) {
            console.log('Token Expired');
            return { accessToken: null, refreshToken: null };

        } else {
            console.log("token is not expired")

            return {
                accessToken, refreshToken
            }
        }


    }
    catch (error) {
        console.log(error);
        return { accessToken: null, refreshToken: null };

    }
}

export const removeAuthToken = async () => {
    try {
        await AsyncStorage.removeItem('accessToken');
        await AsyncStorage.removeItem('refreshToken');
        console.log('Deleted Token Success');
        return
    }
    catch (error) {
        console.log(error);

    }
}