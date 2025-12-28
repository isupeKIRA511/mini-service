import axios from 'axios';

const api = axios.create({
    baseURL: 'https://its.mouamle.space/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

export default api;
