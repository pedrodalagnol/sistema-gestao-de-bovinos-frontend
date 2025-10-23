'use client';

import { useState, FormEvent } from 'react';
import { registrarEntrada, registrarSaida, ItemEstoqueResponseDTO } from '@/app/services/estoqueService';

interface MovimentacaoEstoqueFormProps {
    onClose: () => void;
    onSuccess: () => void;
    item: ItemEstoqueResponseDTO;
    type: 'entrada' | 'saida';
}

export default function MovimentacaoEstoqueForm({ onClose, onSuccess, item, type }: MovimentacaoEstoqueFormProps) {
    const [quantidade, setQuantidade] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const title = type === 'entrada' ? 'Registrar Entrada' : 'Registrar Saída';
    const buttonLabel = type === 'entrada' ? 'Adicionar' : 'Remover';
    const isEntrada = type === 'entrada';

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const qtdValue = parseFloat(quantidade);
        if (isNaN(qtdValue) || qtdValue <= 0) {
            setError('A quantidade deve ser um número positivo.');
            setIsLoading(false);
            return;
        }

        if (!isEntrada && qtdValue > item.quantidadeAtual) {
            setError('A quantidade de saída não pode ser maior que o estoque atual.');
            setIsLoading(false);
            return;
        }

        try {
            if (isEntrada) {
                await registrarEntrada(item.id, qtdValue);
            } else {
                await registrarSaida(item.id, qtdValue);
            }
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error(`Erro ao registrar ${type}:`, err);
            const message = typeof err === 'object' && err !== null && 'response' in err ? (err as { response?: { data?: { message?: string } } }).response?.data?.message : undefined;
            setError(message || 'Ocorreu um erro. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
                <h2 className="mb-4 text-2xl font-bold text-center">{title}</h2>
                <div className="p-4 mb-6 text-center bg-gray-100 rounded-md">
                    <p className="font-semibold text-gray-800">{item.nome}</p>
                    <p className="text-sm text-gray-600">Estoque Atual: <span className="font-bold">{item.quantidadeAtual} {item.unidadeMedida}</span></p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="quantidade" className="block mb-2 text-sm font-medium text-gray-700">Quantidade a {isEntrada ? 'Adicionar' : 'Remover'}</label>
                        <input
                            id="quantidade"
                            type="number"
                            value={quantidade}
                            onChange={(e) => setQuantidade(e.target.value)}
                            className="w-full px-3 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                            min="0.01"
                            step="0.01"
                            autoFocus
                        />
                    </div>

                    {error && <p className="mb-4 text-sm text-center text-red-500">{error}</p>}

                    <div className="flex items-center justify-end gap-4">
                        <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">Cancelar</button>
                        <button type="submit" disabled={isLoading} className={`px-4 py-2 font-bold text-white rounded-md disabled:opacity-50 ${isEntrada ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                            {isLoading ? 'Processando...' : buttonLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
