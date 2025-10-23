'use client';

import { useState, useEffect, useMemo } from 'react';
import { LoteDetailsResponseDTO, atribuirAnimais } from '@/app/services/loteService';
import { AnimalResponseDTO, listarAnimais, removerAnimalDoLote } from '@/app/services/animalService';

interface ManageLotAnimalsModalProps {
    onClose: () => void;
    onSuccess: () => void;
    lote: LoteDetailsResponseDTO;
}

export default function ManageLotAnimalsModal({ onClose, onSuccess, lote }: ManageLotAnimalsModalProps) {
    const [allAnimals, setAllAnimals] = useState<AnimalResponseDTO[]>([]);
    const [selectedAnimalIds, setSelectedAnimalIds] = useState<Set<number>>(() => new Set(lote.animais.map(a => a.id)));
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const initialAnimalIds = useMemo(() => new Set(lote.animais.map(a => a.id)), [lote.animais]);

    useEffect(() => {
        listarAnimais()
            .then(data => {
                // Mostra apenas animais que estão no lote atual ou em nenhum lote
                const filteredAnimals = data.filter(animal => animal.lote === null || animal.lote?.id === lote.id);
                setAllAnimals(filteredAnimals);
            })
            .catch(() => setError("Falha ao carregar a lista de animais."))
            .finally(() => setIsLoading(false));
    }, [lote.id]);

    const handleToggleAnimal = (animalId: number) => {
        setSelectedAnimalIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(animalId)) {
                newSet.delete(animalId);
            } else {
                newSet.add(animalId);
            }
            return newSet;
        });
    };

    const handleSubmit = async () => {
        setIsSaving(true);
        setError(null);

        const finalIds = selectedAnimalIds;

        const idsToAdd = [...finalIds].filter(id => !initialAnimalIds.has(id));
        const idsToRemove = [...initialAnimalIds].filter(id => !finalIds.has(id));

        try {
            const promises: Promise<void>[] = [];

            if (idsToAdd.length > 0) {
                promises.push(atribuirAnimais(lote.id, idsToAdd));
            }
            if (idsToRemove.length > 0) {
                idsToRemove.forEach(id => promises.push(removerAnimalDoLote(id)));
            }

            await Promise.all(promises);
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Erro ao gerenciar animais do lote:", err);
            setError("Ocorreu um erro ao salvar as alterações.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-xl flex flex-col" style={{ height: '80vh' }}>
                <h2 className="mb-4 text-2xl font-bold text-center">Gerenciar Animais no Lote: {lote.nome}</h2>
                
                <div className="flex-grow overflow-y-auto border-t border-b py-4 mb-4">
                    {isLoading ? (
                        <p>Carregando animais...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : (
                        <ul className="space-y-2">
                            {allAnimals.map(animal => (
                                <li key={animal.id} className="flex items-center p-2 rounded-md hover:bg-gray-100">
                                    <input 
                                        type="checkbox" 
                                        id={`animal-${animal.id}`}
                                        checked={selectedAnimalIds.has(animal.id)}
                                        onChange={() => handleToggleAnimal(animal.id)}
                                        className="w-5 h-5 mr-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor={`animal-${animal.id}`} className="flex-grow cursor-pointer">
                                        <span className="font-medium">{animal.identificador}</span>
                                        <span className="ml-2 text-sm text-gray-500">({animal.raca}, {animal.sexo})</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {error && <p className="mb-4 text-sm text-center text-red-500">{error}</p>}

                <div className="flex items-center justify-end gap-4">
                    <button type="button" onClick={onClose} disabled={isSaving} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">Cancelar</button>
                    <button type="button" onClick={handleSubmit} disabled={isSaving || isLoading} className="px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50">
                        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            </div>
        </div>
    );
}
