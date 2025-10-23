'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { listarLotes } from '@/app/services/loteService';
import { LoteResponseDTO } from '@/app/services/loteService';
import api from '@/app/services/api';
import LoteForm from '@/app/components/lote/LoteForm';
import MoverParaPastoModal from '@/app/components/lote/MoverParaPastoModal';
import { Edit, Trash2, Move } from 'lucide-react';

export default function LotesPage() {
    const [lotes, setLotes] = useState<LoteResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoteFormOpen, setIsLoteFormOpen] = useState(false);
    const [isMoverModalOpen, setIsMoverModalOpen] = useState(false);
    const [loteToEdit, setLoteToEdit] = useState<LoteResponseDTO | null>(null);
    const [loteToMove, setLoteToMove] = useState<LoteResponseDTO | null>(null);

    const fetchLotes = useCallback(() => {
        setIsLoading(true);
        listarLotes()
            .then(response => setLotes(response))
            .catch(error => console.error("Erro ao buscar lotes:", error))
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        fetchLotes();
    }, [fetchLotes]);

    const handleOpenLoteForm = (lote: LoteResponseDTO | null) => {
        setLoteToEdit(lote);
        setIsLoteFormOpen(true);
    };

    const handleOpenMoverModal = (lote: LoteResponseDTO) => {
        setLoteToMove(lote);
        setIsMoverModalOpen(true);
    };

    const handleCloseModals = () => {
        setIsLoteFormOpen(false);
        setIsMoverModalOpen(false);
        setLoteToEdit(null);
        setLoteToMove(null);
    };

    const handleSuccess = () => {
        fetchLotes();
        handleCloseModals();
    };

    const handleDelete = async (loteId: number) => {
        if (window.confirm('Tem certeza que deseja excluir este lote? Os animais neste lote ficarão sem lote.')) {
            try {
                await api.delete(`/lotes/${loteId}`);
                setLotes(prevLotes => prevLotes.filter(lote => lote.id !== loteId));
            } catch (error) {
                console.error("Erro ao deletar lote:", error);
                alert('Não foi possível excluir o lote.');
            }
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Carregando dados...</div>;
    }

    return (
        <>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Gestão de Lotes</h1>
                <button
                    onClick={() => handleOpenLoteForm(null)}
                    className="flex items-center px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700"
                >
                    + Criar Lote
                </button>
            </div>

            {isLoteFormOpen && (
                <LoteForm
                    onClose={handleCloseModals}
                    onSuccess={handleSuccess}
                    loteToEdit={loteToEdit}
                />
            )}

            {isMoverModalOpen && loteToMove && (
                <MoverParaPastoModal
                    onClose={handleCloseModals}
                    onSuccess={handleSuccess}
                    lote={loteToMove}
                />
            )}

            <div className="bg-white rounded-lg shadow">
                <table className="min-w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Nome</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Descrição</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Pasto Atual</th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {lotes.length > 0 ? (
                            lotes.map(lote => (
                                <tr key={lote.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                                        <Link href={`/lotes/${lote.id}`} className="text-blue-600 hover:underline">
                                            {lote.nome}
                                        </Link>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{lote.descricao || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600">{lote.pastoAtualNome || 'Livre'}</td>
                                    <td className="flex items-center gap-2 px-6 py-4">
                                        <button 
                                            onClick={() => handleOpenMoverModal(lote)} 
                                            className="p-2 text-green-600 rounded-full hover:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                                            title="Mover para Pasto"
                                            disabled={!!lote.pastoAtualNome} // Desabilita se já está em um pasto
                                        >
                                            <Move size={18} />
                                        </button>
                                        <button onClick={() => handleOpenLoteForm(lote)} className="p-2 text-blue-600 rounded-full hover:bg-gray-100" title="Editar">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(lote.id)} className="p-2 text-red-600 rounded-full hover:bg-gray-100" title="Excluir">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Nenhum lote cadastrado.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}