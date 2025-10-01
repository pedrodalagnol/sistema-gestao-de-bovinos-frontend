'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api, { setAuthToken } from '@/app/services/api';
import { AuthContextType, AuthResponseDTO, CadastroRequestDTO, LoginRequestDTO, User } from '@/app/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Função para decodificar o token e extrair os dados do usuário
const decodeToken = (token: string): User | null => {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            id: payload.userId,
            email: payload.sub, // 'sub' (subject) é o campo padrão para o username no JWT
            fazendaId: payload.fazendaId,
        };
    } catch (error) {
        console.error("Falha ao decodificar o token:", error);
        return null;
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const logout = useCallback(() => {
        localStorage.removeItem('authToken');
        setAuthToken(null);
        setUser(null);
        router.push('/login');
    }, [router]);

    useEffect(() => {
        // Configura o interceptor do Axios para deslogar automaticamente em caso de erro 401/403
        const interceptor = api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                    console.log("Sessão inválida ou expirada. Fazendo logout...");
                    logout();
                }
                return Promise.reject(error);
            }
        );

        // Verifica se já existe um token no localStorage ao carregar a aplicação
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                const decodedUser = decodeToken(token);
                if (decodedUser) {
                    setAuthToken(token);
                    setUser(decodedUser);
                } else {
                    // Se o token for inválido, limpa
                    logout();
                }
            }
        } catch (error) {
            console.error("Erro ao processar token inicial:", error);
            logout();
        } finally {
            setIsLoading(false);
        }

        // Função de limpeza para remover o interceptor quando o componente desmontar
        return () => {
            api.interceptors.response.eject(interceptor);
        };
    }, [logout]);

    const handleAuth = (token: string) => {
        localStorage.setItem('authToken', token);
        setAuthToken(token);
        const decodedUser = decodeToken(token);
        setUser(decodedUser);
        router.push('/');
    };

    const register = async (data: CadastroRequestDTO) => {
        const response = await api.post<AuthResponseDTO>('/auth/registrar', data);
        handleAuth(response.data.token);
    };

    const login = async (data: LoginRequestDTO) => {
        const response = await api.post<AuthResponseDTO>('/auth/login', data);
        handleAuth(response.data.token);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, register, logout, isLoading }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

// Hook customizado para facilitar o uso do contexto
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};