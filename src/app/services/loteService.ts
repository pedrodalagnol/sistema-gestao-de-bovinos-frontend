import api from './api';
import { AnimalResponseDTO } from './animalService'; // Supondo que animalService exporte este tipo

// --- Tipos e Interfaces ---

export interface LoteResponseDTO {
    id: number;
    nome: string;
    descricao: string;
    pastoAtualNome: string | null;
}

export interface LoteDetailsResponseDTO {
    id: number;
    nome: string;
    descricao: string;
    pastoAtualNome: string | null;
    animais: AnimalResponseDTO[];
}

// --- Funções do Serviço ---

/**
 * Busca todos os lotes da fazenda do usuário logado.
 */
export const listarLotes = async (): Promise<LoteResponseDTO[]> => {
    const response = await api.get<LoteResponseDTO[]>('/lotes');
    return response.data;
};

/**
 * Busca os detalhes de um lote específico, incluindo a lista de animais.
 * @param id - O ID do lote.
 */
export const getLoteById = async (id: number): Promise<LoteDetailsResponseDTO> => {
    const response = await api.get<LoteDetailsResponseDTO>(`/lotes/${id}`);
    return response.data;
};

/**
 * Atribui uma lista de animais a um lote específico.
 * @param loteId O ID do lote.
 * @param animalIds A lista de IDs dos animais a serem atribuídos.
 */
export const atribuirAnimais = async (loteId: number, animalIds: number[]): Promise<void> => {
    await api.post(`/lotes/${loteId}/atribuir-animais`, { animalIds });
};
