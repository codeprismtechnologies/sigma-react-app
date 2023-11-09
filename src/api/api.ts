import axios from 'axios';

const api = axios.create({
    baseURL: 'https://14a8-183-82-115-163.ngrok-free.app', // Replace with your API base URL
});

export default api;
