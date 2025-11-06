"use client"; // This component is interactive, so it's a Client Component

import { useState } from 'react';
import { saveReceita } from '../../../actions/receitas';

// The component receives 'produtos' and 'insumos' as props
export default function FormReceita({ produtos, insumos }) {
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState(null);
  const [itensReceita, setItensReceita] = useState([]);
  const [insumoIdAtual, setInsumoIdAtual] = useState('');
  const [quantidadeAtual, setQuantidadeAtual] = useState('');

  // All your other functions (handleAddItem, handleSubmit) are correct and can stay as they are.

  function handleAddItem() {
    if (!insumoIdAtual || !quantidadeAtual) {
      alert('Selecione um insumo e informe a quantidade.');
      return;
    }
    const insumo = insumos.find(i => i.id === parseInt(insumoIdAtual));
    if (insumo && !itensReceita.some(item => item.insumoId === insumo.id)) {
      setItensReceita([
        ...itensReceita,
        { insumoId: insumo.id, insumoNome: insumo.nome, quantidade: parseFloat(quantidadeAtual), unidade: insumo.unidadeDeMedida }
      ]);
      setInsumoIdAtual('');
      setQuantidadeAtual('');
    } else {
      alert('Insumo já adicionado ou inválido.');
    }
  }

  async function handleSubmit() {
    if (!produtoSelecionadoId || itensReceita.length === 0) {
      alert('Selecione um produto e adicione pelo menos um insumo.');
      return;
    }
    const resultado = await saveReceita(produtoSelecionadoId, itensReceita.map(item => ({ insumoId: item.insumoId, quantidade: item.quantidade })));
    alert(resultado.message);
    if (resultado.success) {
      setProdutoSelecionadoId(null);
      setItensReceita([]);
    }
  }

  // Add a simple loading state in case the props are not ready yet
  if (!produtos || !insumos) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Montar Receita</h2>
      <div className="mb-4">
        <label className="font-bold">Produto</label>
        <select value={produtoSelecionadoId ?? ''} onChange={e => setProdutoSelecionadoId(Number(e.target.value))} className="border rounded w-full py-2 px-3">
          <option value="">Selecione...</option>
          {/* This will now work because 'produtos' is a valid array */}
          {produtos.map(p => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
      </div>
      <div className="border-t pt-4 mt-4">
        <h3 className="font-semibold mb-2">Ingredientes</h3>
        <div className="flex gap-4 mb-4">
          <select value={insumoIdAtual} onChange={e => setInsumoIdAtual(e.target.value)} className="border rounded w-1/2 py-2 px-3">
            <option value="">Selecione um insumo...</option>
            {/* This will now work because 'insumos' is a valid array */}
            {insumos.map(i => (
              <option key={i.id} value={i.id}>{i.nome} ({i.unidadeDeMedida})</option>
            ))}
          </select>
          <input type="number" value={quantidadeAtual} min="0.001" step="0.001" onChange={e => setQuantidadeAtual(e.target.value)} className="border rounded w-1/4 py-2 px-3" placeholder="Quantidade" />
          <button type="button" className="bg-blue-500 text-white rounded px-4" onClick={handleAddItem}>Adicionar</button>
        </div>
        <ul className="list-disc pl-5 mb-6">
          {itensReceita.map(item => (
            <li key={item.insumoId} className="flex justify-between items-center">
              <span>{item.insumoNome} - {item.quantidade} {item.unidade}</span>
              <button type="button" className="text-red-500" onClick={() => setItensReceita(itensReceita.filter(i => i.insumoId !== item.insumoId))}>REMOVER</button>
            </li>
          ))}
        </ul>
        <button type="button" className="bg-green-500 text-white rounded px-6 w-full" onClick={handleSubmit}>
          Salvar Receita
        </button>
      </div>
    </div>
  );
}