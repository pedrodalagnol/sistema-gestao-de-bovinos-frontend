'use client';

import { useState, useEffect } from 'react';
import api from '@/app/services/api';
import { Lote, LoteRequestDTO } from '@/app/types/lote';

interface LoteFormProps {
    onClose: () => void;
    onSuccess: () => void;
    loteToEdit?: Lote | null;
}

export default function LoteForm({ onClose, onSuccess, loteToEdit }: LoteFormProps) {
    const [formData, setFormData] = useState<LoteRequestDTO>({
        nome: '',
        descricao: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (loteToEdit) {
            setFormData({
                nome: loteToEdit.nome,
                descricao: loteToEdit.descricao,
            });
        }
    }, [loteToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            if (loteToEdit) {
                await api.put(`/lotes/${loteToEdit.id}`, formData);
            } else {
                await api.post('/lotes', formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError('Falha ao salvar o lote. Verifique os dados.');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-2xl">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
                    {loteToEdit ? 'Editar Lote' : 'Criar Novo Lote'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="nome" className="block mb-1 font-medium text-gray-700">Nome do Lote</label>
                        <input type="text" name="nome" id="nome" value={formData.nome} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div>
                        <label htmlFor="descricao" className="block mb-1 font-medium text-gray-700">Descrição</label>
                        <textarea name="descricao" id="descricao" value={formData.descricao} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"></textarea>
                    </div>
                    
                    {error && <p className="text-sm text-center text-red-600">{error}</p>}

                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                            Cancelar
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-300">
                            {isSubmitting ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}