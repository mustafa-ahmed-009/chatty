import axios from 'axios';
export const axiosInstance = axios.create({
    baseURL: 'https://chatty-woe2.onrender.com/api/v1/',
    timeout: 5000,
    withCredentials: true,
    // headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
    // },
});