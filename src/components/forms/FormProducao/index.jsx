"use client";

import { useState } from 'react';
import { registrarProducaoECalcularCusto } from '../../../actions/vendas';
import { useSession } from 'next-auth/react';
// 1. IMPORTE A ACTION CORRETA para registrar produção!

export default function FormProducao({ produtosCadastrados }) {
  const [produtoId, setProdutoId] = useState('');
  // 2. RENOMEIE A VARIÁVEL DE ESTADO para refletir a produção
  const [quantidadeProduzida, setQuantidadeProduzida] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const { data: session } = useSession();
  // Corrigido para pegar o ID do usuário, não o 'role'
  const userId = session?.user?.id;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setResultado(null);

    // 3. CHAME A ACTION CORRETA e aguarde (await) a resposta
    const response = await registrarProducaoECalcularCusto(
      Number(produtoId),
      Number(quantidadeProduzida),
      Number(userId)
    );

    // Mostra um feedback para o usuário
    // --- IMPROVED ERROR HANDLING ---
    if (response.success) {
      alert(`${response.message}\nCusto Total: R$ ${response.custoTotal}`);
    } else {
      // If there's a detailed list of errors, format it for the alert
      if (response.errors && response.errors.length > 0) {
        const errorDetails = response.errors.join('\n'); // Join errors with a new line
        alert(`Erro: ${response.message}\n\nDetalhes:\n${errorDetails}`);
      } else {
        // Otherwise, show the generic message
        alert(`Erro: ${response.message}`);
      }
    }

    setResultado(response); // Save the full response to state
    setIsLoading(false);

    if (response.success) {
      setProdutoId('');
      setQuantidadeProduzida('');
    }
  };

  if (!produtosCadastrados) {
    return <div>Carregando produtos...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Registrar Produção</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="produtoProducao" className="block text-gray-700 text-sm font-bold mb-2">
            Produto Fabricado
          </label>
          <select
            id="produtoProducao"
            value={produtoId}
            onChange={(e) => setProdutoId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            required
          >
            <option value="" disabled>Selecione um produto</option>
            {produtosCadastrados.map((produto) => (
              <option key={produto.id} value={produto.id}>
                {produto.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="quantidadeProduzida" className="block text-gray-700 text-sm font-bold mb-2">
            Quantidade Produzida (unidades)
          </label>
          <input
            type="number"
            id="quantidadeProduzida"
            // 4. USE A VARIÁVEL DE ESTADO CORRETA aqui
            value={quantidadeProduzida}
            onChange={(e) => setQuantidadeProduzida(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            placeholder="Ex: 50"
            min="1"
            required
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400"
          >
            {isLoading ? "Registrando..." : "Registrar Produção"}
          </button>
        </div>
      </form>
      {/* --- IMPROVED RESULT/ERROR DISPLAY --- */}
      {resultado && (
        <div className={`mt-4 p-3 rounded text-left ${resultado.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="font-bold">{resultado.message}</p>
          {resultado.custoTotal && <p>Custo Total: <strong>R$ {resultado.custoTotal}</strong></p>}

          {/* If there are specific errors, list them */}
          {resultado.errors && (
            <ul className="list-disc pl-5 mt-2 text-sm">
              {resultado.errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}