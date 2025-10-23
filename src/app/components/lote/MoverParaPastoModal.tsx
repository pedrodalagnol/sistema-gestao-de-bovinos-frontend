'use client';

import { useState, useEffect, FormEvent } from 'react';
import { alocarLote, listarPastos, PastoResponseDTO } from '@/app/services/pastoService';
import { LoteResponseDTO } from '@/app/services/loteService';

interface MoverParaPastoModalProps {
    onClose: () => void;
    onSuccess: () => void;
    lote: LoteResponseDTO;
}

export default function MoverParaPastoModal({ onClose, onSuccess, lote }: MoverParaPastoModalProps) {
    const [availablePastos, setAvailablePastos] = useState<PastoResponseDTO[]>([]);
    const [selectedPastoId, setSelectedPastoId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAvailablePastos = async () => {
            try {
                const allPastos = await listarPastos();
                // Filtra para mostrar apenas pastos que não têm um lote alocado
                const available = allPastos.filter(pasto => pasto.loteAlocado === null);
                setAvailablePastos(available);
            } catch (err) {
                console.error("Erro ao buscar pastos disponíveis:", err);
                setError("Não foi possível carregar a lista de pastos disponíveis.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAvailablePastos();
    }, []);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!selectedPastoId) {
            setError('Por favor, selecione um pasto de destino.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            await alocarLote(parseInt(selectedPastoId, 10), lote.id);
            onSuccess();
            onClose();
        } catch (err: unknown) {
            console.error("Erro ao mover lote para pasto:", err);
            const message = typeof err === 'object' && err !== null && 'response' in err ? (err as { response?: { data?: { message?: string } } }).response?.data?.message : undefined;
            setError(message || 'Ocorreu um erro ao mover o lote.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl">
                <h2 className="mb-4 text-2xl font-bold text-center">Mover Lote para Pasto</h2>
                <div className="p-4 mb-6 text-center bg-gray-100 rounded-md">
                    <p className="font-semibold text-gray-800">Lote: {lote.nome}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="pasto" className="block mb-2 text-sm font-medium text-gray-700">Selecione o Pasto de Destino</label>
                        <select 
                            id="pasto" 
                            value={selectedPastoId} 
                            onChange={(e) => setSelectedPastoId(e.target.value)} 
                            className="w-full px-3 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                            disabled={isLoading}
                        >
                            <option value="">-- Pastos Disponíveis --</option>
                            {availablePastos.map(pasto => (
                                <option key={pasto.id} value={pasto.id}>{pasto.nome} (Área: {pasto.areaHa} ha)</option>
                            ))}
                        </select>
                        {availablePastos.length === 0 && !isLoading && (
                            <p className="mt-2 text-sm text-center text-gray-500">Nenhum pasto disponível no momento.</p>
                        )}
                    </div>

                    {error && <p className="mb-4 text-sm text-center text-red-500">{error}</p>}

                    <div className="flex items-center justify-end gap-4">
                        <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">Cancelar</button>
                        <button type="submit" disabled={isLoading || availablePastos.length === 0} className="px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? 'Movendo...' : 'Mover para Pasto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
