
import { HistoricoEvento } from '@/app/types/animal';
import type { ReactNode } from 'react';
import { 
    Scale, Syringe, ArrowRightLeft, ShieldCheck, Pill, TestTube2, 
    ClipboardCheck, HeartHandshake, Tag, LogIn, LogOut, DollarSign, Skull 
} from 'lucide-react';

interface EventHistoryProps {
    historico: HistoricoEvento[];
}

const eventIcons: Record<string, ReactNode> = {
    PESAGEM: <Scale className="w-5 h-5 mr-3 text-blue-500" />,
    VACINACAO: <ShieldCheck className="w-5 h-5 mr-3 text-purple-500" />,
    VERMIFUGACAO: <Pill className="w-5 h-5 mr-3 text-orange-500" />,
    MEDICACAO: <Syringe className="w-5 h-5 mr-3 text-red-500" />,
    INSEMINACAO: <TestTube2 className="w-5 h-5 mr-3 text-pink-500" />,
    DIAGNOSTICO_GESTACAO: <ClipboardCheck className="w-5 h-5 mr-3 text-pink-700" />,
    PARTO: <HeartHandshake className="w-5 h-5 mr-3 text-green-500" />,
    IDENTIFICACAO: <Tag className="w-5 h-5 mr-3 text-gray-500" />,
    MUDANCA_LOTE: <ArrowRightLeft className="w-5 h-5 mr-3 text-indigo-500" />,
    ENTRADA_LOTE: <LogIn className="w-5 h-5 mr-3 text-cyan-500" />,
    SAIDA_LOTE: <LogOut className="w-5 h-5 mr-3 text-yellow-500" />,
    VENDA: <DollarSign className="w-5 h-5 mr-3 text-green-600" />,
    MORTE: <Skull className="w-5 h-5 mr-3 text-black" />,
};

const eventNames: { [key: string]: string } = {
    PESAGEM: 'Pesagem',
    VACINACAO: 'Vacinação',
    VERMIFUGACAO: 'Vermifugação',
    MEDICACAO: 'Medicação',
    INSEMINACAO: 'Inseminação',
    DIAGNOSTICO_GESTACAO: 'Diagnóstico de Gestação',
    PARTO: 'Parto',
    IDENTIFICACAO: 'Identificação',
    MUDANCA_LOTE: 'Mudança de Lote',
    ENTRADA_LOTE: 'Entrada no Lote',
    SAIDA_LOTE: 'Saída do Lote',
    VENDA: 'Venda',
    MORTE: 'Morte',
};

export default function EventHistory({ historico }: EventHistoryProps) {
    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="pb-4 mb-4 text-xl font-bold border-b">Histórico de Eventos</h2>
            {historico.length > 0 ? (
                <ul className="space-y-4 overflow-y-auto max-h-[500px]">
                    {[...historico].reverse().map(evento => (
                        <li key={evento.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center mb-2">
                                {eventIcons[evento.tipoEvento] || null}
                                <p className="font-semibold text-gray-800">
                                    {eventNames[evento.tipoEvento] || evento.tipoEvento.replace('_', ' ')}
                                </p>
                            </div>
                            <div className="pl-8 text-sm text-gray-600">
                                <p>Data: {new Date(evento.dataEvento).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</p>
                                {evento.valor != null && <p>Valor: {evento.valor}</p>}
                                {evento.observacoes && <p>Obs: {evento.observacoes}</p>}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 py-8">Nenhum evento registrado.</p>
            )}
        </div>
    );
}
