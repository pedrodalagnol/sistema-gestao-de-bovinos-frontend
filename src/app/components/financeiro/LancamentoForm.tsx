'use client';

import { useState, useEffect, FormEvent } from 'react';
import { 
    LancamentoFinanceiroRequestDTO, 
    LancamentoFinanceiroResponseDTO, 
    TipoLancamento, 
    criarLancamento, 
    atualizarLancamento 
} from '@/app/services/financeiroService';
import { LoteResponseDTO, listarLotes } from '@/app/services/loteService';

interface LancamentoFormProps {
    onClose: () => void;
    onSuccess: () => void;
    lancamentoToEdit: LancamentoFinanceiroResponseDTO | null;
}

export default function LancamentoForm({ onClose, onSuccess, lancamentoToEdit }: LancamentoFormProps) {
    const [descricao, setDescricao] = useState('');
    const [valor, setValor] = useState('');
    const [tipo, setTipo] = useState<TipoLancamento>(TipoLancamento.DESPESA);
    const [dataLancamento, setDataLancamento] = useState(new Date().toISOString().split('T')[0]);
    const [categoria, setCategoria] = useState('');
    const [loteId, setLoteId] = useState<string>(''); // Armazena o ID do lote como string

    const [lotes, setLotes] = useState<LoteResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEditMode = lancamentoToEdit !== null;

    // Busca a lista de lotes ao montar o componente
    useEffect(() => {
        listarLotes()
            .then(setLotes)
            .catch(err => console.error("Erro ao buscar lotes", err));
    }, []);

    // Preenche o formulário se estiver em modo de edição
    useEffect(() => {
        if (isEditMode && lancamentoToEdit) {
            setDescricao(lancamentoToEdit.descricao);
            setValor(String(lancamentoToEdit.valor));
            setTipo(lancamentoToEdit.tipo);
            setDataLancamento(lancamentoToEdit.dataLancamento);
            setCategoria(lancamentoToEdit.categoria);
            setLoteId(lancamentoToEdit.loteId ? String(lancamentoToEdit.loteId) : '');
        }
    }, [isEditMode, lancamentoToEdit]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const valorValue = parseFloat(valor);
        if (isNaN(valorValue) || valorValue <= 0) {
            setError('O valor deve ser um número positivo.');
            setIsLoading(false);
            return;
        }

        const data: LancamentoFinanceiroRequestDTO = {
            descricao,
            valor: valorValue,
            tipo,
            dataLancamento,
            categoria,
            loteId: loteId ? parseInt(loteId, 10) : undefined,
        };

        try {
            if (isEditMode && lancamentoToEdit) {
                await atualizarLancamento(lancamentoToEdit.id, data);
            } else {
                await criarLancamento(data);
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            console.error("Erro ao salvar lançamento:", err);
            setError(err.response?.data?.message || 'Ocorreu um erro. Verifique os dados e tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-xl">
                <h2 className="mb-6 text-2xl font-bold text-center">{isEditMode ? 'Editar Lançamento' : 'Novo Lançamento'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <label htmlFor="descricao" className="block mb-2 text-sm font-medium text-gray-700">Descrição</label>
                            <input id="descricao" type="text" value={descricao} onChange={(e) => setDescricao(e.target.value)} className="w-full input-class" required />
                        </div>

                        <div>
                            <label htmlFor="valor" className="block mb-2 text-sm font-medium text-gray-700">Valor (R$)</label>
                            <input id="valor" type="number" value={valor} onChange={(e) => setValor(e.target.value)} className="w-full input-class" required min="0.01" step="0.01" />
                        </div>

                        <div>
                            <label htmlFor="tipo" className="block mb-2 text-sm font-medium text-gray-700">Tipo</label>
                            <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value as TipoLancamento)} className="w-full input-class" required>
                                <option value={TipoLancamento.DESPESA}>Despesa</option>
                                <option value={TipoLancamento.RECEITA}>Receita</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="dataLancamento" className="block mb-2 text-sm font-medium text-gray-700">Data</label>
                            <input id="dataLancamento" type="date" value={dataLancamento} onChange={(e) => setDataLancamento(e.target.value)} className="w-full input-class" required />
                        </div>

                        <div>
                            <label htmlFor="categoria" className="block mb-2 text-sm font-medium text-gray-700">Categoria</label>
                            <input id="categoria" type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full input-class" placeholder="Ex: Venda, Compra de Insumos" required />
                        </div>

                        <div className="md:col-span-2">
                            <label htmlFor="loteId" className="block mb-2 text-sm font-medium text-gray-700">Associar ao Lote (Opcional)</label>
                            <select id="loteId" value={loteId} onChange={(e) => setLoteId(e.target.value)} className="w-full input-class">
                                <option value="">Nenhum</option>
                                {lotes.map(lote => (
                                    <option key={lote.id} value={lote.id}>{lote.nome}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {error && <p className="mt-4 text-sm text-center text-red-500">{error}</p>}

                    <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t">
                        <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50">Cancelar</button>
                        <button type="submit" disabled={isLoading} className="px-4 py-2 font-bold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50">
                            {isLoading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
            <style jsx>{`
                .input-class {
                    display: block;
                    width: 100%;
                    padding: 0.5rem 0.75rem;
                    font-size: 0.875rem;
                    line-height: 1.25rem;
                    border: 1px solid #D1D5DB;
                    border-radius: 0.375rem;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                }
                .input-class:focus {
                    outline: 2px solid transparent;
                    outline-offset: 2px;
                    border-color: #10B981;
                    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.5);
                }
            `}</style>
        </div>
    );
}
