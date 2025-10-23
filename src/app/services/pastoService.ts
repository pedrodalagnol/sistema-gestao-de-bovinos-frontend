
import api from './api';

// Enum para o status do pasto, espelhando o backend
export enum PastoStatus {
    EM_USO = 'EM_USO',
    EM_DESCANSO = 'EM_DESCANSO',
    VEDADO = 'VEDADO',
}

// --- Tipos e Interfaces ---

// DTO para resposta de Lote (simplificado, como visto no backend)
export interface LoteResponseDTO {
    id: number;
    nome: string;
    descricao: string;
}

// DTO para resposta de Pasto
export interface PastoResponseDTO {
    id: number;
    nome: string;
    areaHa: number;
    status: PastoStatus;
    dataInicioStatus: string; // A data virá como string no JSON
    loteAlocado: LoteResponseDTO | null;
    taxaOcupacao: number;
}

// DTO para criação e atualização de Pasto
export interface PastoRequestDTO {
    nome: string;
    areaHa: number;
}

// --- Funções do Serviço ---

/**
 * Busca todos os pastos da fazenda do usuário logado.
 */
export const listarPastos = async (): Promise<PastoResponseDTO[]> => {
    const response = await api.get<PastoResponseDTO[]>('/pastos');
    return response.data;
};

/**
 * Cria um novo pasto.
 * @param data - Os dados do novo pasto.
 */
export const criarPasto = async (data: PastoRequestDTO): Promise<PastoResponseDTO> => {
    const response = await api.post<PastoResponseDTO>('/pastos', data);
    return response.data;
};

/**
 * Atualiza um pasto existente.
 * @param id - O ID do pasto a ser atualizado.
 * @param data - Os novos dados do pasto.
 */
export const atualizarPasto = async (id: number, data: PastoRequestDTO): Promise<PastoResponseDTO> => {
    const response = await api.put<PastoResponseDTO>(`/pastos/${id}`, data);
    return response.data;
};

/**
 * Deleta um pasto.
 * @param id - O ID do pasto a ser deletado.
 */
export const deletarPasto = async (id: number): Promise<void> => {
    await api.delete(`/pastos/${id}`);
};

/**
 * Aloca um lote a um pasto.
 * @param pastoId - O ID do pasto.
 * @param loteId - O ID do lote a ser alocado.
 */
export const alocarLote = async (pastoId: number, loteId: number): Promise<void> => {
    await api.post(`/pastos/${pastoId}/alocar/${loteId}`);
};

/**
 * Libera um pasto, desassociando o lote e atualizando seu status.
 * @param pastoId - O ID do pasto a ser liberado.
 * @param novoStatus - O novo status do pasto (EM_DESCANSO ou VEDADO).
 */
export const liberarPasto = async (pastoId: number, novoStatus: PastoStatus): Promise<void> => {
    if (novoStatus === PastoStatus.EM_USO) {
        throw new Error('Status inválido para liberar pasto. Use EM_DESCANSO ou VEDADO.');
    }
    await api.post(`/pastos/${pastoId}/liberar?novoStatus=${novoStatus}`);
};
