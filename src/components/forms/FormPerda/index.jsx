"use client";

import { useState, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useSession } from 'next-auth/react';
import { registrarPerda } from '@/actions/perdasActions'; // Verifique o caminho

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full disabled:bg-gray-400">
      {pending ? "Registrando..." : "Registrar Perda"}
    </button>
  );
}

export default function FormPerda({ produtos, insumos }) {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const registrarPerdaComUserId = registrarPerda.bind(null, userId);
  const [formState, formAction] = useActionState(registrarPerdaComUserId, {});

  const [tipo, setTipo] = useState('PRODUTO');

  // Lógica para alternar a lista de itens no dropdown
  const listaDeItens = tipo === 'PRODUTO' ? produtos : insumos;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Registrar Perda</h2>
      <form action={formAction}>
        {formState?.message && (
          <p className={`p-2 mb-4 text-center rounded ${formState.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {formState.message}
          </p>
        )}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Tipo de Perda</label>
          <select name="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)} className="shadow border rounded w-full py-2 px-3 text-gray-700">
            <option value="PRODUTO">Produto Acabado</option>
            <option value="INSUMO">Insumo (Matéria-prima)</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="itemId" className="block text-gray-700 text-sm font-bold mb-2">Item Perdido</label>
          <select id="itemId" name="itemId" required className="shadow border rounded w-full py-2 px-3 text-gray-700" defaultValue="">
            <option value="" disabled>Selecione um item</option>
            {listaDeItens.map((item) => (
              <option key={item.id} value={item.id}>{item.nome}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="quantidade" className="block text-gray-700 text-sm font-bold mb-2">Quantidade Perdida</label>
          <input type="number" id="quantidade" name="quantidade" required placeholder="Ex: 3" min="0.001" step="0.001" className="shadow border rounded w-full py-2 px-3 text-gray-700" />
        </div>
        <div className="mb-6">
          <label htmlFor="motivo" className="block text-gray-700 text-sm font-bold mb-2">Motivo da Perda</label>
          <input type="text" id="motivo" name="motivo" required placeholder="Ex: Vencimento, Desperdício" className="shadow border rounded w-full py-2 px-3 text-gray-700" />
        </div>
        <SubmitButton />
      </form>
    </div>
  );
}