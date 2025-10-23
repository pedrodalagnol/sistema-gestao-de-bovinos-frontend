'use client';

import { useState, useEffect, FormEvent } from 'react';
import { PastoRequestDTO, PastoResponseDTO, criarPasto, atualizarPasto } from '@/app/services/pastoService';

interface PastoFormProps {
    onClose: () => void;
    onSuccess: () => void;
    pastoToEdit: PastoResponseDTO | null;
}

export default function PastoForm({ onClose, onSuccess, pastoToEdit }: PastoFormProps) {
    const [nome, setNome] = useState('');
    const [areaHa, setAreaHa] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditMode = pastoToEdit !== null;

    useEffect(() => {
        if (isEditMode) {
            setNome(pastoToEdit.nome);
            setAreaHa(String(pastoToEdit.areaHa));
        }
    }, [isEditMode, pastoToEdit]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const areaValue = parseFloat(areaHa);
        if (isNaN(areaValue) || areaValue <= 0) {
            setError('A área deve ser um número positivo.');
            setIsLoading(false);
            return;
        }

        const pastoData: PastoRequestDTO = { nome, areaHa: areaValue };

        try {
            if (isEditMode) {
                await atualizarPasto(pastoToEdit.id, pastoData);
            } else {
                await criarPasto(pastoData);
            }
            onSuccess(); // Recarrega a lista na página principal
            onClose();   // Fecha o modal
        } catch (err: unknown) {
            console.error('Erro ao salvar pasto:', err);
            const message = typeof err === 'object' && err !== null && 'response' in err ? (err as { response?: { data?: { message?: string } } }).response?.data?.message : undefined;
            setError(message || 'Ocorreu um erro ao salvar o pasto.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
                <h2 className="mb-6 text-2xl font-bold text-center">{isEditMode ? 'Editar Pasto' : 'Novo Pasto'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="nome" className="block mb-2 text-sm font-medium text-gray-700">Nome do Pasto</label>
                        <input
                            id="nome"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="areaHa" className="block mb-2 text-sm font-medium text-gray-700">Área (em hectares)</label>
                        <input
                            id="areaHa"
                            type="number"
                            value={areaHa}
                            onChange={(e) => setAreaHa(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                            min="0.01"
                            step="0.01"
                        />
                    </div>

                    {error && <p className="mb-4 text-sm text-center text-red-500">{error}</p>}

                    <div className="flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            {isLoading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
