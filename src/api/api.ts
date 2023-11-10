import axios from 'axios';

const api = axios.create({
    baseURL: 'https://075f-2405-201-c00a-ea0c-889-85a6-3dbb-6ae1.ngrok-free.app/', // Replace with your API base URL
});

export default api;
