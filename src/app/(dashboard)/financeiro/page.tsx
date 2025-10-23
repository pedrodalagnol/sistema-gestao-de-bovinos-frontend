'use client';

import { useCallback, useEffect, useState } from 'react';
import { listarLancamentos, deletarLancamento, LancamentoFinanceiroResponseDTO, TipoLancamento } from '@/app/services/financeiroService';
import { Edit, Trash2, PlusCircle } from 'lucide-react';

import LancamentoForm from '@/app/components/financeiro/LancamentoForm';

// Helper para formatar moeda
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

// Helper para formatar data
const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
};

export default function FinanceiroPage() {
    const [lancamentos, setLancamentos] = useState<LancamentoFinanceiroResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lancamentoToEdit, setLancamentoToEdit] = useState<LancamentoFinanceiroResponseDTO | null>(null);

    const fetchLancamentos = useCallback(() => {
        setIsLoading(true);
        listarLancamentos()
            .then(data => {
                const sortedData = data.sort((a, b) => new Date(b.dataLancamento).getTime() - new Date(a.dataLancamento).getTime());
                setLancamentos(sortedData);
                setError(null);
            })
            .catch((err: unknown) => {
                console.error("Erro ao buscar lançamentos:", err);
                setError("Falha ao carregar os lançamentos. Tente novamente mais tarde.");
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchLancamentos();
    }, [fetchLancamentos]);

    const handleDelete = async (lancamentoId: number) => {
        if (window.confirm('Tem certeza que deseja excluir este lançamento?')) {
            try {
                await deletarLancamento(lancamentoId);
                setLancamentos(prev => prev.filter(item => item.id !== lancamentoId));
            } catch (error: unknown) {
                console.error("Falha ao excluir o lançamento:", error);
                const message = typeof error === 'object' && error !== null && 'response' in error
                    ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
                    : undefined;
                alert(message || 'Não foi possível excluir o lançamento.');
            }
        }
    };

    const handleOpenModal = (lancamento: LancamentoFinanceiroResponseDTO | null) => {
        setLancamentoToEdit(lancamento);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setLancamentoToEdit(null);
    };

    const handleSuccess = () => {
        fetchLancamentos();
        handleCloseModal();
    };

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Lançamentos Financeiros</h1>
                <button onClick={() => handleOpenModal(null)} className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700">
                    <PlusCircle size={20} />
                    Adicionar Lançamento
                </button>
            </div>

            {isModalOpen && <LancamentoForm onClose={handleCloseModal} onSuccess={handleSuccess} lancamentoToEdit={lancamentoToEdit} />}

            <div className="bg-white rounded-lg shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Descrição</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Valor</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Tipo</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Categoria</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Data</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan={6} className="px-6 py-4 text-center">Carregando...</td></tr>
                        ) : error ? (
                            <tr><td colSpan={6} className="px-6 py-4 text-center text-red-500">{error}</td></tr>
                        ) : lancamentos.length > 0 ? (
                            lancamentos.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{item.descricao}</td>
                                    <td className={`px-6 py-4 font-semibold ${item.tipo === TipoLancamento.RECEITA ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.tipo === TipoLancamento.DESPESA ? '- ' : ''}{formatCurrency(item.valor)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.tipo === TipoLancamento.RECEITA ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {item.tipo}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{item.categoria}</td>
                                    <td className="px-6 py-4 text-gray-500">{formatDate(item.dataLancamento)}</td>
                                    <td className="flex items-center gap-4 px-6 py-4">
                                        <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-900" title="Editar"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900" title="Excluir"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">Nenhum lançamento financeiro encontrado.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
