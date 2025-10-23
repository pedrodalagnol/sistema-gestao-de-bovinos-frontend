'use client';

import { useState, FormEvent } from 'react';
import { liberarPasto, PastoResponseDTO, PastoStatus } from '@/app/services/pastoService';

interface LiberarPastoModalProps {
    onClose: () => void;
    onSuccess: () => void;
    pasto: PastoResponseDTO;
}

export default function LiberarPastoModal({ onClose, onSuccess, pasto }: LiberarPastoModalProps) {
    const [novoStatus, setNovoStatus] = useState<PastoStatus>(PastoStatus.EM_DESCANSO);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await liberarPasto(pasto.id, novoStatus);
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error('Erro ao liberar pasto:', err);
            const message = typeof err === 'object' && err !== null && 'response' in err ? (err as { response?: { data?: { message?: string } } }).response?.data?.message : undefined;
            setError(message || 'Ocorreu um erro ao liberar o pasto.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
                <h2 className="mb-4 text-2xl font-bold text-center">Liberar Pasto</h2>
                <div className="p-4 mb-6 text-center bg-gray-100 rounded-md">
                    <p>Você está prestes a liberar o lote <span className='font-bold'>{pasto.loteAlocado?.nome}</span> do pasto <span className='font-bold'>{pasto.nome}</span>.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700">Definir novo status para o pasto:</label>
                        <select 
                            id="status" 
                            value={novoStatus} 
                            onChange={(e) => setNovoStatus(e.target.value as PastoStatus)} 
                            className="w-full px-3 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        >
                            <option value={PastoStatus.EM_DESCANSO}>EM DESCANSO</option>
                            <option value={PastoStatus.VEDADO}>VEDADO</option>
                        </select>
                    </div>

                    {error && <p className="mb-4 text-sm text-center text-red-500">{error}</p>}

                    <div className="flex items-center justify-end gap-4">
                        <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">Cancelar</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 font-bold text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50">
                            {isLoading ? 'Liberando...' : 'Liberar Pasto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
