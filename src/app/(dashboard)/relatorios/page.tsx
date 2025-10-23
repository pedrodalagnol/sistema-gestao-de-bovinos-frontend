'use client';

import { useState } from 'react';
import { getFluxoDeCaixa, getDRE, RelatorioFluxoCaixaDTO, RelatorioDRE_DTO } from '@/app/services/financeiroService';

// Helper para formatar moeda
const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
};

export default function RelatoriosPage() {
    // Define o período padrão como o mês atual
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString().split('T')[0];

    const [dataInicio, setDataInicio] = useState(firstDayOfMonth);
    const [dataFim, setDataFim] = useState(lastDayOfMonth);
    const [fluxoCaixa, setFluxoCaixa] = useState<RelatorioFluxoCaixaDTO | null>(null);
    const [dre, setDre] = useState<RelatorioDRE_DTO | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGerarRelatorios = async () => {
        setIsLoading(true);
        setError(null);
        setFluxoCaixa(null);
        setDre(null);

        try {
            const [fluxoCaixaData, dreData] = await Promise.all([
                getFluxoDeCaixa(dataInicio, dataFim),
                getDRE(dataInicio, dataFim)
            ]);
            setFluxoCaixa(fluxoCaixaData);
            setDre(dreData);
        } catch (err) {
            console.error("Erro ao gerar relatórios:", err);
            setError("Falha ao gerar relatórios. Verifique o período e tente novamente.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h1 className="mb-8 text-3xl font-bold">Relatórios Financeiros</h1>

            {/* Seção de Filtros */}
            <div className="p-6 mb-8 bg-white rounded-lg shadow">
                <h2 className="mb-4 text-xl font-semibold">Período do Relatório</h2>
                <div className="flex flex-wrap items-end gap-4">
                    <div>
                        <label htmlFor="dataInicio" className="block mb-1 text-sm font-medium text-gray-600">Data de Início</label>
                        <input id="dataInicio" type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                        <label htmlFor="dataFim" className="block mb-1 text-sm font-medium text-gray-600">Data de Fim</label>
                        <input id="dataFim" type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <button onClick={handleGerarRelatorios} disabled={isLoading} className="px-6 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400">
                        {isLoading ? 'Gerando...' : 'Gerar Relatórios'}
                    </button>
                </div>
            </div>

            {/* Seção de Resultados */}
            {error && <p className="text-center text-red-500">{error}</p>}
            {isLoading && <p className="text-center">Carregando dados...</p>}

            {!isLoading && (fluxoCaixa || dre) && (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Card Fluxo de Caixa */}
                    {fluxoCaixa && (
                        <div className="p-6 bg-white rounded-lg shadow">
                            <h3 className="mb-4 text-lg font-semibold border-b pb-2">Fluxo de Caixa</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Total de Receitas</span>
                                    <span className="font-semibold text-green-600">{formatCurrency(fluxoCaixa.totalReceitas)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total de Despesas</span>
                                    <span className="font-semibold text-red-600">{formatCurrency(fluxoCaixa.totalDespesas)}</span>
                                </div>
                                <div className="flex justify-between pt-3 text-lg border-t">
                                    <span className="font-bold">Saldo Final</span>
                                    <span className={`font-bold ${fluxoCaixa.saldoFinal >= 0 ? 'text-gray-800' : 'text-red-600'}`}>{formatCurrency(fluxoCaixa.saldoFinal)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Card DRE */}
                    {dre && (
                        <div className="p-6 bg-white rounded-lg shadow">
                            <h3 className="mb-4 text-lg font-semibold border-b pb-2">DRE - Demonstrativo de Resultado</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>(+) Receita Operacional Bruta</span>
                                    <span className="font-semibold text-green-600">{formatCurrency(dre.totalReceitas)}</span>
                                </div>
                                <div className="pl-4 mt-2">
                                    <p className="mb-1 font-medium">(-) Despesas Operacionais</p>
                                    {Object.entries(dre.despesasPorCategoria).map(([categoria, valor]) => (
                                        <div key={categoria} className="flex justify-between text-sm text-gray-600">
                                            <span>{categoria}</span>
                                            <span>{formatCurrency(valor)}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between pt-2 border-t">
                                    <span>Total de Despesas</span>
                                    <span className="font-semibold text-red-600">{formatCurrency(dre.totalDespesas)}</span>
                                </div>
                                <div className="flex justify-between pt-3 text-lg border-t">
                                    <span className="font-bold">Resultado Líquido</span>
                                    <span className={`font-bold ${dre.resultadoLiquido >= 0 ? 'text-gray-800' : 'text-red-600'}`}>{formatCurrency(dre.resultadoLiquido)}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}
