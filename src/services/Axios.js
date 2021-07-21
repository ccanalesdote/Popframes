import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';

const URL = 'https://api.popframes.co.uk';
// const URL = 'http://localhost:8082';

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
        let token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = token;
        }
        return config;
    },
    error => {
        Promise.reject(error)
    }
);

FormAPI.interceptors.request.use(
    async config => {
        let token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = token;
        }
        return config;
    },
    error => {
        Promise.reject(error)
    }
);