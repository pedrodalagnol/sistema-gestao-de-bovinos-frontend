
import api from './api';

// --- Enums e Tipos ---

export enum UnidadeMedida {
    KG = 'KG',
    LITROS = 'LITROS',
    UNIDADE = 'UNIDADE',
}

export interface ItemEstoqueResponseDTO {
    id: number;
    nome: string;
    categoria: string;
    unidadeMedida: UnidadeMedida;
    quantidadeAtual: number;
}

export interface ItemEstoqueRequestDTO {
    nome: string;
    categoria: string;
    unidadeMedida: UnidadeMedida;
    quantidadeInicial: number; // Usado apenas na criação
}

export interface MovimentacaoEstoqueRequestDTO {
    quantidade: number;
}

// --- Funções do Serviço ---

/**
 * Busca todos os itens de estoque da fazenda do usuário logado.
 */
export const listarItensEstoque = async (): Promise<ItemEstoqueResponseDTO[]> => {
    const response = await api.get<ItemEstoqueResponseDTO[]>('/estoque');
    return response.data;
};

/**
 * Cria um novo item de estoque.
 * @param data - Os dados do novo item.
 */
export const criarItemEstoque = async (data: ItemEstoqueRequestDTO): Promise<ItemEstoqueResponseDTO> => {
    const response = await api.post<ItemEstoqueResponseDTO>('/estoque', data);
    return response.data;
};

/**
 * Atualiza os dados de um item de estoque (exceto quantidade).
 * @param id - O ID do item a ser atualizado.
 * @param data - Os novos dados do item.
 */
export const atualizarItemEstoque = async (id: number, data: Omit<ItemEstoqueRequestDTO, 'quantidadeInicial'>): Promise<ItemEstoqueResponseDTO> => {
    const response = await api.put<ItemEstoqueResponseDTO>(`/estoque/${id}`, data);
    return response.data;
};

/**
 * Deleta um item de estoque.
 * @param id - O ID do item a ser deletado.
 */
export const deletarItemEstoque = async (id: number): Promise<void> => {
    await api.delete(`/estoque/${id}`);
};

/**
 * Registra a entrada de uma quantidade para um item de estoque.
 * @param id - O ID do item.
 * @param quantidade - A quantidade a ser adicionada.
 */
export const registrarEntrada = async (id: number, quantidade: number): Promise<void> => {
    const data: MovimentacaoEstoqueRequestDTO = { quantidade };
    await api.post(`/estoque/${id}/entrada`, data);
};

/**
 * Registra a saída de uma quantidade para um item de estoque.
 * @param id - O ID do item.
 * @param quantidade - A quantidade a ser removida.
 */
export const registrarSaida = async (id: number, quantidade: number): Promise<void> => {
    const data: MovimentacaoEstoqueRequestDTO = { quantidade };
    await api.post(`/estoque/${id}/saida`, data);
};
