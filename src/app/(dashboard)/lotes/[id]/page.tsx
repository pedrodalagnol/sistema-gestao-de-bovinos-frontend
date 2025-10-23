'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getLoteById, LoteDetailsResponseDTO } from '@/app/services/loteService';
import Link from 'next/link';
import { Users } from 'lucide-react';

import ManageLotAnimalsModal from '@/app/components/lote/ManageLotAnimalsModal';

// Helper para formatar data
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(date);
};

export default function LoteDetailsPage() {
    const params = useParams();
    const id = Number(params.id);

    const [lote, setLote] = useState<LoteDetailsResponseDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isManageModalOpen, setIsManageModalOpen] = useState(false);

    const fetchLoteDetails = useCallback(() => {
        if (!id) return;
        setIsLoading(true);
        getLoteById(id)
            .then(data => {
                setLote(data);
                setError(null);
            })
            .catch(err => {
                console.error(`Erro ao buscar detalhes do lote ${id}:`, err);
                setError("Lote não encontrado ou falha ao carregar dados.");
            })
            .finally(() => setIsLoading(false));
    }, [id]);

    useEffect(() => {
        fetchLoteDetails();
    }, [fetchLoteDetails]);

    const handleSuccess = () => {
        fetchLoteDetails();
        setIsManageModalOpen(false);
    };

    if (isLoading) {
        return <div className="text-center py-10">Carregando detalhes do lote...</div>;
    }

    if (error) {
        return <div className="text-center py-10 text-red-500">{error}</div>;
    }

    if (!lote) {
        return <div className="text-center py-10">Lote não encontrado.</div>;
    }

    return (
        <>
            {isManageModalOpen && (
                <ManageLotAnimalsModal 
                    onClose={() => setIsManageModalOpen(false)} 
                    onSuccess={handleSuccess} 
                    lote={lote} 
                />
            )}

            <div className="mb-8">
                <h1 className="text-3xl font-bold">{lote.nome}</h1>
                <p className="text-lg text-gray-600 mt-1">{lote.descricao}</p>
                <p className="text-md text-gray-500 mt-2">Pasto Atual: <span className="font-semibold">{lote.pastoAtualNome || 'Nenhum'}</span></p>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-bold">Animais no Lote ({lote.animais.length})</h2>
                    <button 
                        onClick={() => setIsManageModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        <Users size={16} />
                        Editar Animais no Lote
                    </button>
                </div>
                <table className="min-w-full">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="th-class">Identificador</th>
                            <th className="th-class">Sexo</th>
                            <th className="th-class">Raça</th>
                            <th className="th-class">Nascimento</th>
                            <th className="th-class">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {lote.animais.length > 0 ? (
                            lote.animais.map(animal => (
                                <tr key={animal.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium">
                                        <Link href={`/animais/${animal.id}`} className="text-blue-600 hover:underline">
                                            {animal.identificador}
                                        </Link>
                                    </td>
                                    <td className="td-class">{animal.sexo}</td>
                                    <td className="td-class">{animal.raca}</td>
                                    <td className="td-class">{formatDate(animal.dataNascimento)}</td>
                                    <td className="td-class">
                                        <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">{animal.status}</span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">Nenhum animal neste lote.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <style jsx>{`
                .th-class {
                    padding: 0.75rem 1.5rem;
                    text-align: left;
                    font-size: 0.75rem;
                    color: #6B7280;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .td-class {
                    padding: 1rem 1.5rem;
                    white-space: nowrap;
                }
            `}</style>
        </>
    );
}
