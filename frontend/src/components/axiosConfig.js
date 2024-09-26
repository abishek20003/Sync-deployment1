import axios from 'axios';

// Create an instance of axios with default settings
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL, // Use the environment variable for the base URL
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;
