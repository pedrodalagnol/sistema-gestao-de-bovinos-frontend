
import api from './api';

// --- Enums e Tipos ---

export enum TipoLancamento {
    RECEITA = 'RECEITA',
    DESPESA = 'DESPESA',
}

export interface LancamentoFinanceiroResponseDTO {
    id: number;
    descricao: string;
    valor: number;
    tipo: TipoLancamento;
    dataLancamento: string; // Formato YYYY-MM-DD
    categoria: string;
    loteId: number | null;
}

export interface LancamentoFinanceiroRequestDTO {
    descricao: string;
    valor: number;
    tipo: TipoLancamento;
    dataLancamento: string; // Formato YYYY-MM-DD
    categoria: string;
    loteId?: number | null;
}

export interface RelatorioFluxoCaixaDTO {
    totalReceitas: number;
    totalDespesas: number;
    saldoFinal: number;
}

export interface RelatorioDRE_DTO {
    totalReceitas: number;
    despesasPorCategoria: Record<string, number>; // Objeto onde a chave é a categoria e o valor é o total
    totalDespesas: number;
    resultadoLiquido: number;
}

// --- Funções do Serviço (CRUD) ---

export const listarLancamentos = async (): Promise<LancamentoFinanceiroResponseDTO[]> => {
    const response = await api.get<LancamentoFinanceiroResponseDTO[]>('/financeiro/lancamentos');
    return response.data;
};

export const criarLancamento = async (data: LancamentoFinanceiroRequestDTO): Promise<LancamentoFinanceiroResponseDTO> => {
    const response = await api.post<LancamentoFinanceiroResponseDTO>('/financeiro/lancamentos', data);
    return response.data;
};

export const atualizarLancamento = async (id: number, data: LancamentoFinanceiroRequestDTO): Promise<LancamentoFinanceiroResponseDTO> => {
    const response = await api.put<LancamentoFinanceiroResponseDTO>(`/financeiro/lancamentos/${id}`, data);
    return response.data;
};

export const deletarLancamento = async (id: number): Promise<void> => {
    await api.delete(`/financeiro/lancamentos/${id}`);
};

// --- Funções do Serviço (Relatórios) ---

export const getFluxoDeCaixa = async (dataInicio: string, dataFim: string): Promise<RelatorioFluxoCaixaDTO> => {
    const response = await api.get<RelatorioFluxoCaixaDTO>('/financeiro/relatorios/fluxo-caixa', {
        params: { dataInicio, dataFim }
    });
    return response.data;
};

export const getDRE = async (dataInicio: string, dataFim: string): Promise<RelatorioDRE_DTO> => {
    const response = await api.get<RelatorioDRE_DTO>('/financeiro/relatorios/dre', {
        params: { dataInicio, dataFim }
    });
    return response.data;
};

export const getCustoPorArroba = async (loteId: number): Promise<number> => {
    const response = await api.get<number>(`/financeiro/relatorios/custo-arroba/${loteId}`);
    return response.data;
};
