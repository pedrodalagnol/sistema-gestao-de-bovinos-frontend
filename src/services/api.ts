import axios from 'axios';

// Cria uma instância do Axios com a URL base do backend
const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Verifique se a porta está correta
});

// Função para definir o token de autorização nos headers
export const setAuthToken = (token: string | null) => {
    if (token) {
        // Adiciona o token em todas as requisições futuras
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        // Remove o token se ele for nulo (logout)
        delete api.defaults.headers.common['Authorization'];
    }
};

export default api;