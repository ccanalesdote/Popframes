import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const URL = 'http://popframesapi-env.eba-umrqg6b3.us-east-1.elasticbeanstalk.com';

export const API = axios.create({
    baseURL: URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const FormAPI = axios.create({
    baseURL: URL,
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});

API.interceptors.request.use(
    async config => {
        const token = await AsyncStorage.getItem('token');
        console.log(token);
        if (token) {
            config.headers['Authorization'] = token;
        }
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => {
        Promise.reject(error)
    }
);

FormAPI.interceptors.request.use(
    config => {
        const token = localStorage.getItem('auth');
        if (token) {
            config.headers['Authorization'] = token;
        }
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => {
        Promise.reject(error)
    }
);