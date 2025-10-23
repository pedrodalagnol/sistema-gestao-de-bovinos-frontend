'use client';

import { useState, useEffect, FormEvent } from 'react';
import { alocarLote, PastoResponseDTO } from '@/app/services/pastoService';
import { listarLotes, LoteResponseDTO } from '@/app/services/loteService';
import { listarPastos } from '@/app/services/pastoService';

interface AlocarLoteModalProps {
    onClose: () => void;
    onSuccess: () => void;
    pasto: PastoResponseDTO;
}

export default function AlocarLoteModal({ onClose, onSuccess, pasto }: AlocarLoteModalProps) {
    const [availableLotes, setAvailableLotes] = useState<LoteResponseDTO[]>([]);
    const [selectedLoteId, setSelectedLoteId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Para encontrar lotes disponíveis, buscamos todos os lotes e todos os pastos,
        // e então filtramos os lotes que já estão alocados em algum pasto.
        const fetchAvailableLotes = async () => {
            try {
                const [allLotes, allPastos] = await Promise.all([
                    listarLotes(),
                    listarPastos()
                ]);

                const allocatedLoteIds = new Set(allPastos.map(p => p.loteAlocado?.id).filter(id => id));
                const available = allLotes.filter(lote => !allocatedLoteIds.has(lote.id));
                
                setAvailableLotes(available);
            } catch (err) {
                console.error("Erro ao buscar lotes disponíveis:", err);
                setError("Não foi possível carregar a lista de lotes disponíveis.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAvailableLotes();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedLoteId) {
            setError('Por favor, selecione um lote.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await alocarLote(pasto.id, parseInt(selectedLoteId, 10));
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error("Erro ao alocar lote:", err);
            setError(err.response?.data?.message || 'Ocorreu um erro ao alocar o lote.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
                <h2 className="mb-4 text-2xl font-bold text-center">Alocar Lote</h2>
                <div className="p-4 mb-6 text-center bg-gray-100 rounded-md">
                    <p className="font-semibold text-gray-800">Pasto: {pasto.nome}</p>
                    <p className="text-sm text-gray-600">Status Atual: <span className="font-bold">{pasto.status}</span></p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="lote" className="block mb-2 text-sm font-medium text-gray-700">Selecione o Lote Disponível</label>
                        <select 
                            id="lote" 
                            value={selectedLoteId} 
                            onChange={(e) => setSelectedLoteId(e.target.value)} 
                            className="w-full px-3 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                            disabled={isLoading}
                        >
                            <option value="">-- Selecione um lote --</option>
                            {availableLotes.map(lote => (
                                <option key={lote.id} value={lote.id}>{lote.nome}</option>
                            ))}
                        </select>
                        {availableLotes.length === 0 && !isLoading && (
                            <p className="mt-2 text-sm text-center text-gray-500">Nenhum lote disponível para alocação.</p>
                        )}
                    </div>

                    {error && <p className="mb-4 text-sm text-center text-red-500">{error}</p>}

                    <div className="flex items-center justify-end gap-4">
                        <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">Cancelar</button>
                        <button type="submit" disabled={isLoading || availableLotes.length === 0} className="px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? 'Alocando...' : 'Alocar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
