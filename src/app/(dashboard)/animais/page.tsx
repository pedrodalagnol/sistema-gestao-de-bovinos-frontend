'use client';

import { useCallback, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import { AnimalResponseDTO, listarAnimais } from '@/app/services/animalService';
import { LoteResponseDTO, listarLotes } from '@/app/services/loteService';
import AnimalForm from '@/app/components/animal/AnimalForm';
import { Edit, Trash2, Search } from 'lucide-react';
import AssignLoteModal from '@/app/components/animal/AssignLoteModal';
import api from '@/app/services/api'; // Para o handleDelete

export default function RebanhoPage() {
    const { isAuthenticated } = useAuth();
    const [animais, setAnimais] = useState<AnimalResponseDTO[]>([]);
    const [allLotes, setAllLotes] = useState<LoteResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [animalToEdit, setAnimalToEdit] = useState<AnimalResponseDTO | null>(null);
    const [selectedAnimalIds, setSelectedAnimalIds] = useState<number[]>([]);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    // Estados dos Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sexoFilter, setSexoFilter] = useState('');
    const [loteFilter, setLoteFilter] = useState('');

    const fetchData = useCallback(() => {
        setIsLoading(true);
        Promise.all([listarAnimais(), listarLotes()])
            .then(([animaisData, lotesData]) => {
                // Ordena por identificador
                const sortedAnimais = animaisData.sort((a, b) => a.identificador.localeCompare(b.identificador));
                setAnimais(sortedAnimais);
                setAllLotes(lotesData);
            })
            .catch(error => console.error("Erro ao buscar dados:", error))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated, fetchData]);

    const statusOptions = useMemo(() => {
        const allStatuses = new Set(animais.map(a => a.status));
        return Array.from(allStatuses);
    }, [animais]);

    const filteredAnimais = useMemo(() => {
        return animais.filter(animal => {
            const searchMatch = animal.identificador.toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = statusFilter ? animal.status === statusFilter : true;
            const sexoMatch = sexoFilter ? animal.sexo === sexoFilter : true;
            const loteMatch = loteFilter ? String(animal.lote?.id || 'null') === loteFilter : true;
            return searchMatch && statusMatch && sexoMatch && loteMatch;
        });
    }, [animais, searchTerm, statusFilter, sexoFilter, loteFilter]);

    const handleSuccess = () => {
        fetchData();
        setIsModalOpen(false);
        setIsAssignModalOpen(false);
    };

    const handleOpenModalForCreate = () => {
        setAnimalToEdit(null);
        setIsModalOpen(true);
    };

    const handleOpenModalForEdit = (animal: AnimalResponseDTO) => {
        setAnimalToEdit(animal);
        setIsModalOpen(true);
    };

    const handleDelete = async (animalId: number) => {
        if (window.confirm('Tem certeza que deseja excluir este animal?')) {
            try {
                await api.delete(`/animais/${animalId}`);
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

            {isModalOpen && <AnimalForm onClose={() => setIsModalOpen(false)} onSuccess={handleSuccess} animalToEdit={animalToEdit} />}
            {isAssignModalOpen && <AssignLoteModal animalIds={selectedAnimalIds} onClose={() => setIsAssignModalOpen(false)} onSuccess={handleSuccess} />}

            {/* Filtros */}
            <div className="p-4 mb-6 bg-white rounded-lg shadow">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <div className="relative">
                        <label htmlFor="search" className="sr-only">Buscar</label>
                        <input 
                            type="text" 
                            id="search"
                            placeholder="Buscar por Identificador..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full py-2 pl-10 pr-4 border rounded-md"
                        />
                        <Search className="absolute top-1/2 left-3 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <select onChange={e => setStatusFilter(e.target.value)} value={statusFilter} className="w-full p-2 border rounded-md">
                        <option value="">Todos os Status</option>
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select onChange={e => setSexoFilter(e.target.value)} value={sexoFilter} className="w-full p-2 border rounded-md">
                        <option value="">Ambos os Sexos</option>
                        <option value="Macho">Macho</option>
                        <option value="Fêmea">Fêmea</option>
                    </select>
                    <select onChange={e => setLoteFilter(e.target.value)} value={loteFilter} className="w-full p-2 border rounded-md">
                        <option value="">Todos os Lotes</option>
                        <option value="null">Sem Lote</option>
                        {allLotes.map(lote => <option key={lote.id} value={lote.id}>{lote.nome}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow">
                <table className="min-w-full">
                    {/* ... thead ... */}
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            {/* Checkbox de seleção removido para simplificar a UI com filtros */}
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Identificador</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Lote</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Raça</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Sexo</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Nascimento</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan={7} className="px-6 py-4 text-center">Carregando...</td></tr>
                        ) : filteredAnimais.length > 0 ? (
                            filteredAnimais.map(animal => (
                                <tr key={animal.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">
                                        <Link href={`/animais/${animal.id}`} className="text-green-600 hover:underline">
                                            {animal.identificador}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4">{animal.lote ? animal.lote.nome : 'Sem Lote'}</td>
                                    <td className="px-6 py-4">{animal.raca}</td>
                                    <td className="px-6 py-4">{animal.sexo}</td>
                                    <td className="px-6 py-4">{new Date(animal.dataNascimento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${animal.status === 'Vendido' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{animal.status}</span>
                                    </td>
                                    <td className="flex items-center gap-4 px-6 py-4">
                                        <button onClick={() => handleOpenModalForEdit(animal)} className="text-blue-600 hover:text-blue-900" title="Editar"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(animal.id)} className="text-red-600 hover:text-red-900" title="Excluir"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={7} className="px-6 py-4 text-center text-gray-500">Nenhum animal encontrado com os filtros atuais.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}