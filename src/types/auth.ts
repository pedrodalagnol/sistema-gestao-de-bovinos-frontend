// Tipos que correspondem aos DTOs do backend

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

export interface AuthResponseDTO {
    token: string;
}