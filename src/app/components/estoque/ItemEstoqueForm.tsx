'use client';

import { useState, useEffect, FormEvent } from 'react';
import {
    ItemEstoqueRequestDTO,
    ItemEstoqueResponseDTO,
    UnidadeMedida,
    criarItemEstoque,
    atualizarItemEstoque
} from '@/app/services/estoqueService';

interface ItemEstoqueFormProps {
    onClose: () => void;
    onSuccess: () => void;
    itemToEdit: ItemEstoqueResponseDTO | null;
}

export default function ItemEstoqueForm({ onClose, onSuccess, itemToEdit }: ItemEstoqueFormProps) {
    const [nome, setNome] = useState('');
    const [categoria, setCategoria] = useState('');
    const [unidadeMedida, setUnidadeMedida] = useState<UnidadeMedida>(UnidadeMedida.UNIDADE);
    const [quantidadeInicial, setQuantidadeInicial] = useState('0');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditMode = itemToEdit !== null;

    useEffect(() => {
        if (isEditMode && itemToEdit) {
            setNome(itemToEdit.nome);
            setCategoria(itemToEdit.categoria);
            setUnidadeMedida(itemToEdit.unidadeMedida);
        }
    }, [isEditMode, itemToEdit]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const qtdInicialValue = parseFloat(quantidadeInicial);
        if (!isEditMode && (isNaN(qtdInicialValue) || qtdInicialValue < 0)) {
            setError('A quantidade inicial deve ser um número positivo ou zero.');
            setIsLoading(false);
            return;
        }

        try {
            if (isEditMode && itemToEdit) {
                const data: Omit<ItemEstoqueRequestDTO, 'quantidadeInicial'> = { nome, categoria, unidadeMedida };
                await atualizarItemEstoque(itemToEdit.id, data);
            } else {
                const data: ItemEstoqueRequestDTO = { nome, categoria, unidadeMedida, quantidadeInicial: qtdInicialValue };
                await criarItemEstoque(data);
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error("Erro ao salvar o item:", err);
            setError(err.response?.data?.message || 'Ocorreu um erro. Verifique os dados e tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-xl">
                <h2 className="mb-6 text-2xl font-bold text-center">{isEditMode ? 'Editar Item' : 'Novo Item no Estoque'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-700">Nome do Item</label>
                            <input id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full input-class" required />
                        </div>
                        <div>
                            <label htmlFor="categoria" className="block mb-2 text-sm font-medium text-gray-700">Categoria</label>
                            <input id="categoria" type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full input-class" placeholder='Ex: Medicamento, Ração' required />
                        </div>
                        <div>
                            <label htmlFor="unidadeMedida" className="block mb-2 text-sm font-medium text-gray-700">Unidade de Medida</label>
                            <select id="unidadeMedida" value={unidadeMedida} onChange={(e) => setUnidadeMedida(e.target.value as UnidadeMedida)} className="w-full input-class" required>
                                {Object.values(UnidadeMedida).map(unit => (
                                    <option key={unit} value={unit}>{unit}</option>
                                ))}
                            </select>
                        </div>
                        {!isEditMode && (
                            <div className="md:col-span-2">
                                <label htmlFor="quantidadeInicial" className="block mb-2 text-sm font-medium text-gray-700">Quantidade Inicial</label>
                                <input id="quantidadeInicial" type="number" value={quantidadeInicial} onChange={(e) => setQuantidadeInicial(e.target.value)} className="w-full input-class" required min="0" step="0.01" />
                                <p className="mt-1 text-xs text-gray-500">A quantidade poderá ser alterada depois através das ações de Entrada e Saída.</p>
                            </div>
                        )}
                    </div>

                    {error && <p className="mt-4 text-sm text-center text-red-500">{error}</p>}

                    <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t">
                        <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">Cancelar</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50">
                            {isLoading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
            <style jsx>{`
                .input-class {
                    display: block;
                    width: 100%;
                    padding: 0.5rem 0.75rem;
                    font-size: 0.875rem;
                    line-height: 1.25rem;
                    border: 1px solid #D1D5DB;
                    border-radius: 0.375rem;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                }
                .input-class:focus {
                    outline: 2px solid transparent;
                    outline-offset: 2px;
                    border-color: #10B981;
                    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.5);
                }
            `}</style>
        </div>
    );
}
