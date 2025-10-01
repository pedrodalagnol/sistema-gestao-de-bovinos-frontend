'use client';

import { useState, useEffect } from 'react';
import api from '@/app/services/api';
import { Animal, AnimalRequestDTO } from '@/app/types/animal';

interface AnimalFormProps {
    onClose: () => void;
    onSuccess: () => void;
    animalToEdit?: Animal | null;
}

export default function AnimalForm({ onClose, onSuccess, animalToEdit }: AnimalFormProps) {
    const [formData, setFormData] = useState<AnimalRequestDTO>({
        identificador: '',
        raca: '',
        sexo: 'Macho',
        dataNascimento: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (animalToEdit) {
            setFormData({
                identificador: animalToEdit.identificador,
                raca: animalToEdit.raca,
                sexo: animalToEdit.sexo,
                dataNascimento: animalToEdit.dataNascimento.split('T')[0], // Formata para YYYY-MM-DD
            });
        }
    }, [animalToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            if (animalToEdit) {
                await api.put(`/animais/${animalToEdit.id}`, formData);
            } else {
                await api.post('/animais', formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError('Falha ao salvar. Verifique se o identificador já existe.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-2xl">
                <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">
                    {animalToEdit ? 'Editar Animal' : 'Adicionar Novo Animal'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="identificador" className="block mb-1 font-medium text-gray-700">Identificador (Brinco/Nome)</label>
                        <input type="text" name="identificador" id="identificador" value={formData.identificador} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="raca" className="block mb-1 font-medium text-gray-700">Raça</label>
                        <input type="text" name="raca" id="raca" value={formData.raca} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="sexo" className="block mb-1 font-medium text-gray-700">Sexo</label>
                        <select name="sexo" id="sexo" value={formData.sexo} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                            <option value="Macho">Macho</option>
                            <option value="Fêmea">Fêmea</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="dataNascimento" className="block mb-1 font-medium text-gray-700">Data de Nascimento</label>
                        <input type="date" name="dataNascimento" id="dataNascimento" value={formData.dataNascimento} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    {error && <p className="text-sm text-center text-red-600">{error}</p>}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancelar</button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-300">
                            {isSubmitting ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}