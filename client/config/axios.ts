import axios from 'axios';
import { API_URL } from './global.ts';
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
