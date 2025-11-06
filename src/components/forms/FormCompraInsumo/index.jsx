"use client";

import { useActionState } from "react"; // 1. Importe 'useActionState' de 'react'
import { useFormStatus } from "react-dom";
import { registrarCompraInsumo } from "@/actions/compraActions";
import { useSession } from "next-auth/react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full disabled:bg-gray-400">
      {pending ? "Registrando..." : "Registrar Compra"}
    </button>
  );
}

export default function FormCompraInsumo({ insumos }) {
  const { data: session } = useSession();
  // Corrigido para pegar o ID do usuário, não o 'role'
  const userId = session?.user?.id; 

  // 2. Use .bind() para passar o userId para a sua action.
  // O primeiro argumento de bind é 'null', seguido pelos seus parâmetros.
  const registrarCompraComUserId = registrarCompraInsumo.bind(null, userId);

  // 3. Use o novo hook 'useActionState' com a action "preenchida"
  const [formState, formAction] = useActionState(registrarCompraComUserId, { message: null });

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Registrar Compra de Insumo</h2>
      <form action={formAction}>
        {/* O resto do seu formulário continua igual... */}
        {formState?.message && (
             <p className={`p-2 mb-4 text-center rounded ${formState.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {formState.message}
            </p>
        )}
        <div className="mb-4">
          <label htmlFor="insumoId" className="block text-gray-700 text-sm font-bold mb-2">Insumo Comprado</label>
          <select id="insumoId" name="insumoId" required className="shadow border rounded w-full py-2 px-3 text-gray-700" defaultValue="">
            <option value="" disabled>Selecione um insumo</option>
            {insumos.map((insumo) => (
              <option key={insumo.id} value={insumo.id}>{insumo.nome}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="quantidadeComprada" className="block text-gray-700 text-sm font-bold mb-2">Quantidade Comprada</label>
            <input type="number" id="quantidadeComprada" name="quantidadeComprada" required step="0.001" className="shadow border rounded w-full py-2 px-3 text-gray-700" />
          </div>
          <div>
            <label htmlFor="custoTotal" className="block text-gray-700 text-sm font-bold mb-2">Custo Total (R$)</label>
            <input type="number" id="custoTotal" name="custoTotal" required step="0.01" className="shadow border rounded w-full py-2 px-3 text-gray-700" />
          </div>
        </div>
        <div className="mb-6">
            <label htmlFor="dataCompra" className="block text-gray-700 text-sm font-bold mb-2">Data da Compra</label>
            <input type="date" id="dataCompra" name="dataCompra" required defaultValue={new Date().toISOString().split('T')[0]} className="shadow border rounded w-full py-2 px-3 text-gray-700" />
        </div>
        
        <SubmitButton />
      </form>
    </div>
  );
}