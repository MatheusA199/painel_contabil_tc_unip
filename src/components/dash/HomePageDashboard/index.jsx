"use client";

import { getFinancialStatements } from "../../../actions/financialActions";
import DashboardClient from "../DashboardClient";
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const getMesAtual = () => {
  const date = new Date();
  const inicio = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
  const fim = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
  return { inicio, fim };
}

export default function HomePageDashboard() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  const [startDate, setStartDate] = useState(getMesAtual().inicio);
  const [endDate, setEndDate] = useState(getMesAtual().fim);

  // 1. Novo estado para controlar a mensagem de erro do filtro
  const [filterError, setFilterError] = useState('');

  const userId = session?.user?.id;

  const fetchData = async (start, end) => {
    if (!userId) return;

    setLoading(true);
    setFilterError(''); // Limpa erros antigos antes de uma nova busca
    try {
      const financialData = await getFinancialStatements(userId, { startDate: start, endDate: end });
      setDados(financialData);
    } catch (err) {
      console.error("Erro ao buscar dados financeiros:", err);
    } finally {
      setLoading(false);
    }
  };

  // Busca os dados iniciais quando o componente monta
  useEffect(() => {
    if (userId) {
      fetchData(startDate, endDate);
    }
  }, [userId]);

  const handleFilter = () => {
    // 2. Lógica de validação dentro da função handleFilter
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);

    if (d2 < d1) {
      setFilterError("A data de término não pode ser anterior à data de início.");
      return; // Interrompe a execução
    }

    // Se a validação passar, limpa o erro e busca os dados
    setFilterError('');
    fetchData(startDate, endDate);
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 w-full">
      <div className="bg-white p-4 rounded-lg shadow-md mb-8 w-full max-w-4xl flex flex-col items-center justify-center gap-4">
        <div className="flex items-end justify-center gap-4 flex-wrap">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Data de Início</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">Data de Fim</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <button
            onClick={handleFilter}
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400"
          >
            {loading ? "Buscando..." : "Filtrar"}
          </button>
        </div>

        {/* 3. Exibição da mensagem de erro no JSX */}
        {filterError && (
          <div className="mt-2 text-sm text-red-600 font-semibold">
            {filterError}
          </div>
        )}
      </div>

      {/* Lógica de renderização condicional */}
      {loading && <p>Carregando dados...</p>}
      {!loading && !dados && <p>Nenhum dado encontrado para o período.</p>}
      {!loading && dados && <DashboardClient financialData={dados} />}
    </main>
  );
}