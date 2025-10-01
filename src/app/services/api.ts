import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Esta função será usada pelo AuthContext para configurar o token nos headers
export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;