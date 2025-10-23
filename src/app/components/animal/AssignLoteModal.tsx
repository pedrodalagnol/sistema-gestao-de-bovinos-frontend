'use client';

import { useEffect, useState } from "react";
import api from "@/app/services/api";
import { Lote } from "@/app/types/lote";

interface AssignLoteModalProps {
    animalIds: number[];
    onClose: () => void;
    onSuccess: () => void;
}

export default function AssignLoteModal({ animalIds, onClose, onSuccess }: AssignLoteModalProps) {
    const [lotes, setLotes] = useState<Lote[]>([]);
    const [selectedLoteId, setSelectedLoteId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Busca a lista de lotes disponíveis
        api.get('/lotes')
            .then(response => {
                setLotes(response.data);
                if (response.data.length > 0) {
                    setSelectedLoteId(String(response.data[0].id));
                }
            })
            .catch(error => console.error("Erro ao buscar lotes", error))
            .finally(() => setIsLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedLoteId) {
            alert("Por favor, selecione um lote.");
            return;
        }
        try {
            await api.post(`/lotes/${selectedLoteId}/atribuir-animais`, { animalIds });
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Erro ao atribuir animais", error);
            alert("Não foi possível atribuir os animais ao lote.");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
                <h2 className="mb-4 text-xl font-bold">Atribuir Animais a um Lote</h2>
                {isLoading ? (
                    <p>Carregando lotes...</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="lote" className="block mb-2 text-sm font-medium">Selecione o Lote de Destino</label>
                            <select
                                id="lote"
                                value={selectedLoteId}
                                onChange={(e) => setSelectedLoteId(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            >
                                {lotes.map(lote => (
                                    <option key={lote.id} value={lote.id}>{lote.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancelar</button>
                            <button type="submit" className="px-4 py-2 text-white bg-blue-600 rounded-md">Salvar</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}