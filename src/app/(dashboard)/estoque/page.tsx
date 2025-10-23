'use client';

import { useCallback, useEffect, useState } from 'react';
import { listarItensEstoque, deletarItemEstoque, ItemEstoqueResponseDTO } from '@/app/services/estoqueService';
import { Edit, Trash2, PlusCircle, MinusCircle, PackagePlus } from 'lucide-react';

import ItemEstoqueForm from '@/app/components/estoque/ItemEstoqueForm';
import MovimentacaoEstoqueForm from '@/app/components/estoque/MovimentacaoEstoqueForm';

export default function EstoquePage() {
    const [itens, setItens] = useState<ItemEstoqueResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isItemFormOpen, setIsItemFormOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState<ItemEstoqueResponseDTO | null>(null);

    const [isMovimentacaoFormOpen, setIsMovimentacaoFormOpen] = useState(false);
    const [itemToMove, setItemToMove] = useState<ItemEstoqueResponseDTO | null>(null);
    const [movimentacaoType, setMovimentacaoType] = useState<'entrada' | 'saida'>('entrada');

    const fetchItens = useCallback(() => {
        setIsLoading(true);
        listarItensEstoque()
            .then(data => {
                setItens(data);
                setError(null);
            })
            .catch(err => {
                console.error("Erro ao buscar itens de estoque:", err);
                setError("Falha ao carregar o estoque. Tente novamente mais tarde.");
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchItens();
    }, [fetchItens]);

    const handleDelete = async (itemId: number) => {
        if (window.confirm('Tem certeza que deseja excluir este item do estoque?')) {
            try {
                await deletarItemEstoque(itemId);
                setItens(prev => prev.filter(item => item.id !== itemId));
            } catch (error: unknown) {
                console.error("Falha ao excluir o item:", error);
                const message = typeof error === 'object' && error !== null && 'response' in error
                    ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
                    : undefined;
                alert(message || 'Não foi possível excluir o item.');
            }
        }
    };

    const handleOpenItemForm = (item: ItemEstoqueResponseDTO | null) => {
        setItemToEdit(item);
        setIsItemFormOpen(true);
    };

    const handleCloseItemForm = () => {
        setIsItemFormOpen(false);
        setItemToEdit(null);
    };

    const handleOpenMovimentacaoForm = (item: ItemEstoqueResponseDTO, type: 'entrada' | 'saida') => {
        setItemToMove(item);
        setMovimentacaoType(type);
        setIsMovimentacaoFormOpen(true);
    };

    const handleCloseMovimentacaoForm = () => {
        setIsMovimentacaoFormOpen(false);
        setItemToMove(null);
    };

    const handleSuccess = () => {
        fetchItens();
        handleCloseItemForm();
        handleCloseMovimentacaoForm();
    };

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Controle de Estoque</h1>
                <button onClick={() => handleOpenItemForm(null)} className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700">
                    <PackagePlus size={20} />
                    Adicionar Item
                </button>
            </div>

            {isItemFormOpen && <ItemEstoqueForm onClose={handleCloseItemForm} onSuccess={handleSuccess} itemToEdit={itemToEdit} /> }
            {isMovimentacaoFormOpen && itemToMove && <MovimentacaoEstoqueForm onClose={handleCloseMovimentacaoForm} onSuccess={handleSuccess} item={itemToMove} type={movimentacaoType} /> }

            <div className="bg-white rounded-lg shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Nome</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Categoria</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Qtd. Atual</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Unidade</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan={5} className="px-6 py-4 text-center">Carregando...</td></tr>
                        ) : error ? (
                            <tr><td colSpan={5} className="px-6 py-4 text-center text-red-500">{error}</td></tr>
                        ) : itens.length > 0 ? (
                            itens.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{item.nome}</td>
                                    <td className="px-6 py-4 text-gray-500">{item.categoria}</td>
                                    <td className="px-6 py-4 font-semibold">{item.quantidadeAtual}</td>
                                    <td className="px-6 py-4 text-gray-500">{item.unidadeMedida}</td>
                                    <td className="flex items-center gap-3 px-6 py-4">
                                        <button onClick={() => handleOpenMovimentacaoForm(item, 'entrada')} className="p-1 text-green-600 rounded-full hover:bg-green-100" title="Registrar Entrada"><PlusCircle size={18} /></button>
                                        <button onClick={() => handleOpenMovimentacaoForm(item, 'saida')} className="p-1 text-red-600 rounded-full hover:bg-red-100" title="Registrar Saída"><MinusCircle size={18} /></button>
                                        <button onClick={() => handleOpenItemForm(item)} className="p-1 text-blue-600 rounded-full hover:bg-blue-100" title="Editar Item"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(item.id)} className="p-1 text-gray-500 rounded-full hover:bg-gray-100" title="Excluir Item"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={5} className="px-6 py-4 text-center text-gray-500">Nenhum item cadastrado no estoque.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
