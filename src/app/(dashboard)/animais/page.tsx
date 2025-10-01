'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import api from '@/app/services/api';
import { Animal } from '@/app/types/animal';
import AnimalForm from '@/app/components/animal/AnimalForm';
import { Edit, Trash2 } from 'lucide-react';

export default function RebanhoPage() {
    const { isAuthenticated } = useAuth();
    const [animais, setAnimais] = useState<Animal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [animalToEdit, setAnimalToEdit] = useState<Animal | null>(null);

    const fetchAnimais = useCallback(() => {
        setIsLoading(true);
        api.get('/animais')
            .then(response => setAnimais(response.data))
            .catch(error => console.error("Erro ao buscar animais:", error))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchAnimais();
        }
    }, [isAuthenticated, fetchAnimais]);

    const handleSuccess = () => {
        fetchAnimais();
    };

    const handleOpenModalForCreate = () => {
        setAnimalToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenModalForEdit = (animal: Animal) => {
        setAnimalToEdit(animal);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setAnimalToEdit(null);
    };

    const handleDelete = async (animalId: number) => {
        if (window.confirm('Tem certeza que deseja excluir este animal?')) {
            try {
                await api.delete(`/animais/${animalId}`);
                // Remove o animal da lista na UI para feedback instantâneo
                setAnimais(prev => prev.filter(animal => animal.id !== animalId));
            } catch (error) {
                alert('Falha ao excluir o animal.');
            }
        }
    };

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Meu Rebanho</h1>
                <button onClick={handleOpenModalForCreate} className="px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700">
                    + Adicionar Animal
                </button>
            </div>

            {isModalOpen && (
                <AnimalForm
                    onClose={handleCloseModal}
                    onSuccess={handleSuccess}
                    animalToEdit={animalToEdit}
                />
            )}

            <div className="bg-white rounded-lg shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Identificador</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Raça</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Sexo</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Nascimento</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan={6} className="px-6 py-4 text-center">Carregando...</td></tr>
                        ) : animais.length > 0 ? (
                            animais.map(animal => (
                                <tr key={animal.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">
                                        <Link href={`/dashboard/animais/${animal.id}`} className="text-green-600 hover:underline">
                                            {animal.identificador}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">{animal.raca}</td>
                                    <td className="px-6 py-4">{animal.sexo}</td>
                                    <td className="px-6 py-4">{new Date(animal.dataNascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">{animal.status}</span>
                                    </td>
                                    <td className="flex items-center gap-4 px-6 py-4">
                                        <button onClick={() => handleOpenModalForEdit(animal)} className="text-blue-600 hover:text-blue-900" title="Editar"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(animal.id)} className="text-red-600 hover:text-red-900" title="Excluir"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">Nenhum animal cadastrado ainda.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}