import api from './api';

// DTO para informações resumidas do lote, usado dentro do AnimalResponseDTO
export interface LoteResponseDTO {
    id: number;
    nome: string;
    descricao: string;
}

// DTO para a resposta da API ao listar ou buscar um animal
export interface AnimalResponseDTO {
    id: number;
    identificador: string;
    sexo: 'Macho' | 'Fêmea';
    raca: string;
    dataNascimento: string;
    status: string;
    lote: LoteResponseDTO | null;
}

/**
 * Busca todos os animais da fazenda do usuário logado.
 */
export const listarAnimais = async (): Promise<AnimalResponseDTO[]> => {
    const response = await api.get<AnimalResponseDTO[]>('/animais');
    return response.data;
};

/**
 * Remove um animal de seu lote atual.
 * @param animalId O ID do animal a ser removido do lote.
 */
export const removerAnimalDoLote = async (animalId: number): Promise<void> => {
    await api.put(`/animais/${animalId}/remover-do-lote`);
};
