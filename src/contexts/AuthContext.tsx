'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api, { setAuthToken } from '../services/api';
import { CadastroRequestDTO, LoginRequestDTO, AuthResponseDTO } from '../types/auth';

// Define o tipo para os dados do usuário que queremos armazenar
interface User {
    id: number;
    email: string;
    fazendaId: number;
}

// Define o tipo para o valor do nosso contexto
interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (data: LoginRequestDTO) => Promise<void>;
    register: (data: CadastroRequestDTO) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

// Cria o Contexto com um valor padrão
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função para decodificar o token JWT (simplificada)
const decodeToken = (token: string): User | null => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            id: payload.userId,
            email: payload.sub,
            fazendaId: payload.fazendaId,
        };
    } catch (error) {
        console.error("Failed to decode token:", error);
        return null;
    }
};

// Componente Provedor
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Ao carregar a aplicação, verifica se existe um token no localStorage
        const token = localStorage.getItem('authToken');
        if (token) {
            const decodedUser = decodeToken(token);
            if (decodedUser) {
                setUser(decodedUser);
                setAuthToken(token); // Configura o token no Axios
            }
        }
        setIsLoading(false);
    }, []);

    const handleAuth = (token: string) => {
        localStorage.setItem('authToken', token);
        setAuthToken(token);
        const decodedUser = decodeToken(token);
        setUser(decodedUser);
        router.push('/dashboard');
    };

    const register = async (data: CadastroRequestDTO) => {
        try {
            const response = await api.post<AuthResponseDTO>('/auth/registrar', data);
            handleAuth(response.data.token);
        } catch (error) {
            console.error('Erro no registro:', error);
            // Aqui você pode adicionar um estado para exibir mensagens de erro na UI
            throw error;
        }
    };

    const login = async (data: LoginRequestDTO) => {
        try {
            const response = await api.post<AuthResponseDTO>('/auth/login', data);
            handleAuth(response.data.token);
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
        setUser(null);
        router.push('/auth/login');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook customizado para facilitar o uso do contexto
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};