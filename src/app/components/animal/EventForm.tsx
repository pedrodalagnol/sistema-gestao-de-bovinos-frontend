'use client';

import { useState } from 'react';
import api from '@/app/services/api';
import { Plus, ChevronDown } from 'lucide-react';

interface EventFormProps {
    animalId: string;
    onEventAdded: () => void; // Callback para atualizar a página pai
}

export default function EventForm({ animalId, onEventAdded }: EventFormProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [eventType, setEventType] = useState('PESAGEM');
    const [eventDate, setEventDate] = useState(new Date().toISOString().split('T')[0]);
    const [eventValue, setEventValue] = useState('');
    const [eventObs, setEventObs] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (eventType === 'PESAGEM' && !eventValue) {
            alert('O campo "Peso" é obrigatório para pesagem.');
            return;
        }
        setIsSubmitting(true);
        try {
            await api.post(`/animais/${animalId}/eventos`, {
                tipoEvento: eventType,
                dataEvento: eventDate,
                // Só envie o valor se ele for relevante e preenchido
                valor: eventType === 'PESAGEM' ? parseFloat(eventValue) : null,
                observacoes: eventObs
            });
            // Limpa o formulário e fecha
            setEventValue('');
            setEventObs('');
            setIsOpen(false);
            // Chama o callback para o componente pai recarregar os dados
            onEventAdded();
        } catch (error) {
            console.error("Erro ao adicionar evento", error);
            alert("Não foi possível adicionar o evento.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getValorLabel = () => {
        switch (eventType) {
            case 'PESAGEM':
                return 'Peso (kg)';
            default:
                return null; // Não mostra o campo para outros tipos
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md mb-8">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex items-center justify-between w-full text-xl font-bold text-left"
            >
                Adicionar Novo Evento
                <ChevronDown className={`w-6 h-6 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <form onSubmit={handleAddEvent} className="space-y-4 mt-6">
                    <div>
                        <label className="block text-sm font-medium">Tipo de Evento</label>
                        <select value={eventType} onChange={e => setEventType(e.target.value)} className="w-full p-2 mt-1 border border-gray-300 rounded-md">
                            <option value="PESAGEM">Pesagem</option>
                            <option value="VACINACAO">Vacinação</option>
                            <option value="VERMIFUGACAO">Vermifugação</option>
                            <option value="MEDICACAO">Medicação</option>
                            <option value="INSEMINACAO">Inseminação</option>
                            <option value="DIAGNOSTICO_GESTACAO">Diagnóstico de Gestação</option>
                            <option value="PARTO">Parto</option>
                            <option value="IDENTIFICACAO">Identificação</option>
                            <option value="MUDANCA_LOTE">Mudança de Lote</option>
                            <option value="ENTRADA_LOTE">Entrada no Lote</option>
                            <option value="SAIDA_LOTE">Saída do Lote</option>
                            <option value="VENDA">Venda</option>
                            <option value="MORTE">Morte</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Data</label>
                        <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} required className="w-full p-2 mt-1 border border-gray-300 rounded-md"/>
                    </div>
                    {getValorLabel() && (
                        <div>
                            <label className="block text-sm font-medium">{getValorLabel()}</label>
                            <input type="number" step="0.01" value={eventValue} onChange={e => setEventValue(e.target.value)} required className="w-full p-2 mt-1 border border-gray-300 rounded-md"/>
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium">Observações</label>
                        <textarea value={eventObs} onChange={e => setEventObs(e.target.value)} className="w-full p-2 mt-1 border border-gray-300 rounded-md" rows={3}></textarea>
                    </div>
                    <button type="submit" disabled={isSubmitting} className="w-full py-2 font-semibold text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-300">
                        {isSubmitting ? "Salvando..." : "Salvar Evento"}
                    </button>
                </form>
            )}
        </div>
    );
}
