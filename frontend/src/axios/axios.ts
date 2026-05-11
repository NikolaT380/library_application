import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('jwt_token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.warn("Токенот е истечен или невалиден. Ве одјавуваме...");

            sessionStorage.removeItem('jwt_token');

            window.location.href = '/login';
        }

        if (error.response && (error.response.status === 401 || error.response.status === 403 || error.response.status === 500)) {
            sessionStorage.removeItem('jwt_token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;