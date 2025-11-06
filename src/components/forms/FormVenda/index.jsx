"use client";

import { useEffect, useState, useActionState } from 'react'; // 1. Importe 'useActionState' de 'react'
import { useFormStatus } from 'react-dom';
import { registrarVenda } from '../../../actions/vendas';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full disabled:bg-gray-400">
      {pending ? "Registrando..." : "Registrar Venda"}
    </button>
  );
}

export default function FormVenda({ produtos }) {
  // 2. Renomeie o hook para 'useActionState'
  const [formState, formAction] = useActionState(registrarVenda, { message: null, success: false });
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('1'); // Iniciar com '1' é uma boa prática
  const [valorTotal, setValorTotal] = useState(0);

  useEffect(() => {
    if (produtoId && Number(quantidade) > 0) {
      const produtoSelecionado = produtos.find(p => p.id === parseInt(produtoId));
      if (produtoSelecionado) {
        setValorTotal(parseFloat(produtoSelecionado.precoVenda) * Number(quantidade));
      }
    } else {
      setValorTotal(0);
    }
  }, [produtoId, quantidade, produtos]);

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Registrar Nova Venda</h2>
      <form action={formAction}>
        {formState?.message && (
          <div className={`p-3 mb-4 text-center rounded ${formState.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <p className="font-bold">{formState.message}</p>
            {formState.success && (
              <p className="text-sm">
                Faturamento: R$ {formState.faturamento} | CMV: R$ {formState.cmv} | Lucro Bruto: R$ {formState.lucroBruto}
              </p>
            )}
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="produtoId" className="block text-gray-700 text-sm font-bold mb-2">Produto Vendido</label>
          {/* O 'name' aqui é crucial para o formData.get('produtoId') funcionar */}
          <select id="produtoId" name="produtoId" value={produtoId} onChange={e => setProdutoId(e.target.value)} required className="shadow border rounded w-full py-2 px-3">
            <option value="" disabled>Selecione um produto</option>
            {produtos.map(produto => (
              <option key={produto.id} value={produto.id}>{produto.nome} (R$ {produto.precoVenda})</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="quantidadeVendida" className="block text-gray-700 text-sm font-bold mb-2">Quantidade Vendida</label>
           {/* O 'name' aqui é crucial para o formData.get('quantidadeVendida') funcionar */}
          <input type="number" id="quantidadeVendida" name="quantidadeVendida" value={quantidade} onChange={e => setQuantidade(e.target.value)} required min="1" className="shadow border rounded w-full py-2 px-3" />
        </div>
        <div className="mb-6 bg-gray-50 p-3 rounded text-center">
          <p className="text-gray-700 text-lg font-bold">
            Valor Total da Venda: <span className="text-green-600">R$ {valorTotal.toFixed(2)}</span>
          </p>
        </div>
        <SubmitButton />
      </form>
    </div>
  );
}