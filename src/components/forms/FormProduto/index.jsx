"use client";

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { createProduto } from '@/actions/managerProduct'; // Verifique o caminho

function SubmitButton() {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending} className="bg-green-500 text-white font-bold py-2 px-4 rounded w-full disabled:bg-gray-400">{pending ? "Cadastrando..." : "Cadastrar Produto"}</button>;
}

export default function FormProduto() {
    const [formState, formAction] = useActionState(createProduto, {});

    return (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Cadastrar Novo Produto</h2>
            <form action={formAction}>
                {formState?.message && <p className="text-red-500 mb-4">{formState.message}</p>}
                <div className="mb-4">
                    <label htmlFor="nome" className="block font-bold mb-2">Nome do Produto</label>
                    <input type="text" id="nome" name="nome" required className="border rounded w-full py-2 px-3" placeholder="Ex: Brownie Tradicional"/>
                </div>
                <div className="mb-4">
                    <label htmlFor="precoVenda" className="block font-bold mb-2">Preço de Venda (R$)</label>
                    <input type="number" id="precoVenda" name="precoVenda" required className="border rounded w-full py-2 px-3" step="0.01" min="0"/>
                </div>
                {/* NOVO CAMPO ADICIONADO ABAIXO */}
                <div className="mb-6">
                    <label htmlFor="rendimentoReceita" className="block font-bold mb-2">Rendimento da Receita (unidades)</label>
                    <input type="number" id="rendimentoReceita" name="rendimentoReceita" required className="border rounded w-full py-2 px-3" min="1" step="1" placeholder="Ex: 16"/>
                    <p className="text-xs text-gray-500 mt-1">Quantas unidades a sua receita completa produz?</p>
                </div>
                <SubmitButton />
            </form>
        </div>
    );
}