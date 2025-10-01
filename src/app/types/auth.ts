// DTOs para requisições
export interface CadastroRequestDTO {
    nomeFazenda: string;
    nomeUsuario: string;
    email: string;
    senha: string;
}

export interface LoginRequestDTO {
    email: string;
    senha: string;
}

// DTO para a resposta da API de autenticação
export interface AuthResponseDTO {
    token: string;
}

// Interface para os dados do usuário decodificados do token
export interface User {
    id: number;
    email: string;
    fazendaId: number;
}

// Interface para o valor do nosso AuthContext
export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (data: LoginRequestDTO) => Promise<void>;
    register: (data: CadastroRequestDTO) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}