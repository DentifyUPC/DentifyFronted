import axios from 'axios';
import { TokenStorage } from './tokenStorage.js';

const baseURL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ;

const api = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
});

console.log('🌐 API BASE URL:', baseURL);

// ✅ Interceptor de request: añade el token automáticamente
api.interceptors.request.use(
    (config) => {
        const token = TokenStorage.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Interceptor de respuesta: maneja expiración de token
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;
        if (status === 401) {
            TokenStorage.clearAccessToken();
            localStorage.removeItem('user');
            console.warn('⚠️ Sesión expirada, redirigiendo al login...');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
