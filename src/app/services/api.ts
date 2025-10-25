import axios from 'axios';

const api = axios.create({
    baseURL: 'https://sgb-env-2.eba-wz3tucx3.sa-east-1.elasticbeanstalk.com',
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