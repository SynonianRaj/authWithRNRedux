import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    SafeAreaView,
    Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setAuthToken } from '../utils/Storage';

import { useDispatch, useSelector } from 'react-redux';
import { setUserProfileData, setAuthAction } from '../redux/profileDetailRedux/action';
import { isTokenExpired } from '../redux/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

const token = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMyMzU3OTI0LCJpYXQiOjE3MzIzNTQzMjQsImp0aSI6ImViNDEzNDQ4YzdlODRiZjVhZjRkNWQ1OWYwZmI4OWEyIiwidXNlcl9pZCI6MX0.BoXI2s99yolgIKz6vgtXf5TzkJOC1a5cyTjJJql4w_t148HBNrv2UJERwjI52Pb3r9w01Cdolsffndz_fdvBFw"



export default function LoginScreen({ navigation }) {
    console.log("-> 1s")

    const [emailField, setEmailField] = useState('emilys');
    const [passwordField, setPasswordField] = useState('emilyspass');
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const dispatch = useDispatch();
    const uri = 'https://dummyjson.com/auth/login';


    // console.log(isTokenExpired(token))

    const handleLogin = async () => {
        // Trim whitespace from input fields
        const trimmedEmail = emailField.trim();
        const trimmedPassword = passwordField.trim();
        setError(null)
        console.log('username -> ',emailField)
        console.log('password -> ', passwordField)

        if (!trimmedEmail || !trimmedPassword) {
            Alert.alert("Error", "Please enter both email and password.");
            setError("Please enter both email and password.")
            return;
        }

        setLoading(true); // Start loading

        try {

            const response = await axios.post(uri, {
                username: trimmedEmail,
                password: trimmedPassword,

            });

            if (response.status === 200) {

                const { accessToken, refreshToken, ...profileData } = response.data
               
                dispatch(setUserProfileData(profileData));
                dispatch(setAuthAction({ accessToken, refreshToken }));
                await setAuthToken({ accessToken, refreshToken });


            }
        }
        catch (error) {
            setLoading(false); // Stop loading
            setError("Invalid email or password");
            console.error(error);
        }
    }




    return (
        <SafeAreaView style={styles.container}>
            {loading ? ( // Conditional rendering for loading state
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#3bceff" />
                    <Text style={styles.loadingText}>Checking your credentials...</Text>
                </View>
            ) : (
                <>
                    <Image style={styles.logo}
                        source={{
                            uri: 'https://reactnative.dev/img/tiny_logo.png',
                        }} />
                    <Text style={styles.wlcmText}>Welcome Back</Text>

                    <View style={styles.formContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#a6a4a4"
                            keyboardType="email-address"
                            value={emailField}
                            autoCapitalize='none'
                            onChangeText={setEmailField}
                        />

                        <TextInput
                            secureTextEntry={true}
                            style={styles.input}
                            placeholder="Password"
                            placeholderTextColor="#a6a4a4"
                            value={passwordField}
                            onChangeText={setPasswordField}
                        />

                        <TouchableOpacity onPress={() => navigation.navigate("ResetPasswordScreen")}>
                            <Text style={styles.frgtPassText}>Forgot Your Password?</Text>
                        </TouchableOpacity>
                        {error ? <Text style={styles.errorText}>{error}</Text> : null}

                        <TouchableOpacity
                            activeOpacity={0.6}
                            style={styles.loginBtn}
                            onPress={handleLogin}
                        >
                            <Text style={styles.loginText}>LOGIN</Text>
                        </TouchableOpacity>

                        <View style={styles.txtContainer}>
                            <Text style={styles.signUpText}>Don't have an Account?</Text>
                            <TouchableOpacity
                                activeOpacity={0.5}
                                style={styles.signUpBtn}
                                onPress={() => navigation.navigate('RegisterScreen')}>

                                <Text style={styles.signtxt}>Register here</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            )}
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f8f9fa',
        justifyContent: 'center',
    },
    loaderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 18,
        color: "#000",
    },
    logo: {
        alignSelf: 'center',
        height: 100,
        width: 100,
        marginBottom: 20,
    },
    wlcmText: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#343a40',
        marginBottom: 20,
    },
    formContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        marginHorizontal: 15,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    input: {
        height: 50,
        marginBottom: 15,
        borderWidth: 1,
        padding: 10,
        borderColor: '#ced4da',
        borderRadius: 5,
        backgroundColor: '#f8f9fa',
        fontSize: 16,
        color: '#0d0d0d',
    },
    frgtPassText: {
        alignSelf: 'flex-end',
        marginBottom: 10,
        color: '#007bff',
        textDecorationLine: 'underline',
    },
    loginBtn: {
        backgroundColor: '#007bff',
        alignItems: 'center',
        padding: 15,
        borderRadius: 5,
        marginTop: 10,
        elevation: 2,
    },
    txtContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
    },
    loginText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ffffff',
    },
    signUpText: {
        fontSize: 16,
        color: '#6c757d',
    },
    signtxt: {
        color: '#007bff',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 5,
    },
    signUpBtn: {
        paddingHorizontal: 5,
    },
    errorText: {
        color: 'red',
        fontSize: 16,
        fontWeight: '400', // Make it bold for emphasis
        marginTop: 10,   // Add some space below the error message
        textAlign: 'center', // Center the error text
    },
});

