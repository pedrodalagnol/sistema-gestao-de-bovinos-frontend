'use client';

import { useCallback, useEffect, useState } from 'react';
import { listarPastos, deletarPasto, PastoResponseDTO } from '@/app/services/pastoService';
import { Edit, Trash2, PlusCircle, ArrowRightLeft, LogOut } from 'lucide-react';
import PastoForm from '@/app/components/pasto/PastoForm';
import AlocarLoteModal from '@/app/components/pasto/AlocarLoteModal';
import LiberarPastoModal from '@/app/components/pasto/LiberarPastoModal';

export default function PastosPage() {
    const [pastos, setPastos] = useState<PastoResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isPastoFormOpen, setIsPastoFormOpen] = useState(false);
    const [pastoToEdit, setPastoToEdit] = useState<PastoResponseDTO | null>(null);

    const [isAlocarModalOpen, setIsAlocarModalOpen] = useState(false);
    const [isLiberarModalOpen, setIsLiberarModalOpen] = useState(false);
    const [pastoToManage, setPastoToManage] = useState<PastoResponseDTO | null>(null);

    const fetchPastos = useCallback(() => {
        setIsLoading(true);
        listarPastos()
            .then(data => {
                setPastos(data);
                setError(null);
            })
            .catch(err => {
                console.error("Erro ao buscar pastos:", err);
                setError("Falha ao carregar os pastos. Tente novamente mais tarde.");
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchPastos();
    }, [fetchPastos]);

    const handleDelete = async (pastoId: number) => {
        if (window.confirm('Tem certeza que deseja excluir este pasto? A ação não pode ser desfeita.')) {
            try {
                await deletarPasto(pastoId);
                setPastos(prev => prev.filter(pasto => pasto.id !== pastoId));
            } catch (error: any) {
                console.error("Falha ao excluir o pasto:", error);
                alert(error.response?.data?.message || 'Não foi possível excluir o pasto. Verifique se ele não está em uso.');
            }
        }
    };

    const handleSuccess = () => {
        fetchPastos();
        setIsPastoFormOpen(false);
        setIsAlocarModalOpen(false);
        setIsLiberarModalOpen(false);
    };

    const openPastoForm = (pasto: PastoResponseDTO | null) => { setPastoToEdit(pasto); setIsPastoFormOpen(true); };
    const openAlocarModal = (pasto: PastoResponseDTO) => { setPastoToManage(pasto); setIsAlocarModalOpen(true); };
    const openLiberarModal = (pasto: PastoResponseDTO) => { setPastoToManage(pasto); setIsLiberarModalOpen(true); };

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Gerenciamento de Pastos</h1>
                <button onClick={() => openPastoForm(null)} className="flex items-center gap-2 px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700">
                    <PlusCircle size={20} />
                    Adicionar Pasto
                </button>
            </div>

            {isPastoFormOpen && <PastoForm onClose={() => setIsPastoFormOpen(false)} onSuccess={handleSuccess} pastoToEdit={pastoToEdit} />}
            {isAlocarModalOpen && pastoToManage && <AlocarLoteModal onClose={() => setIsAlocarModalOpen(false)} onSuccess={handleSuccess} pasto={pastoToManage} />}
            {isLiberarModalOpen && pastoToManage && <LiberarPastoModal onClose={() => setIsLiberarModalOpen(false)} onSuccess={handleSuccess} pasto={pastoToManage} />}

            <div className="bg-white rounded-lg shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Nome</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Área (ha)</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Lote Alocado</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Taxa de Ocupação</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr><td colSpan={6} className="px-6 py-4 text-center">Carregando...</td></tr>
                        ) : error ? (
                            <tr><td colSpan={6} className="px-6 py-4 text-center text-red-500">{error}</td></tr>
                        ) : pastos.length > 0 ? (
                            pastos.map(pasto => (
                                <tr key={pasto.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">{pasto.nome}</td>
                                    <td className="px-6 py-4">{pasto.areaHa.toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${pasto.status === 'EM_USO' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                            {pasto.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{pasto.loteAlocado ? pasto.loteAlocado.nome : 'Livre'}</td>
                                    <td className="px-6 py-4">{pasto.taxaOcupacao.toFixed(2)} an/ha</td>
                                    <td className="flex items-center gap-2 px-6 py-4">
                                        {pasto.loteAlocado ? (
                                            <button onClick={() => openLiberarModal(pasto)} className="flex items-center gap-1 px-2 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600" title="Liberar Pasto">
                                                <LogOut size={14}/> Liberar
                                            </button>
                                        ) : (
                                            <button onClick={() => openAlocarModal(pasto)} className="flex items-center gap-1 px-2 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600" title="Alocar Lote">
                                                <ArrowRightLeft size={14}/> Alocar
                                            </button>
                                        )}
                                        <button onClick={() => openPastoForm(pasto)} className="p-2 text-blue-600 rounded-full hover:bg-gray-100" title="Editar Pasto"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(pasto.id)} className="p-2 text-red-600 rounded-full hover:bg-gray-100" title="Excluir Pasto"><Trash2 size={18} /></button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={6} className="px-6 py-4 text-center text-gray-500">Nenhum pasto cadastrado ainda.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}
