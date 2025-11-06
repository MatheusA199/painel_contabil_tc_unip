// src/components/FormInsumo.tsx
"use client";

import { useState } from 'react';
import { saveInsumo } from '../../../actions/managerInsumo';


export default function FormInsumo() {
  const [nome, setNome] = useState('');
  const [unidadeDeMedida, setUnidadeDeMedida] = useState('g'); // Valor padrão

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const response = saveInsumo(nome, unidadeDeMedida);
    
    console.log('Dados do Insumo:', { nome, unidadeDeMedida });
    alert(`Insumo "${nome}" cadastrado com sucesso!`);

    // Limpar o formulário após o envio
    setNome('');
    setUnidadeDeMedida('g');
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Cadastrar Novo Insumo</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nome" className="block text-gray-700 text-sm font-bold mb-2">
            Nome do Insumo
          </label>
          <input
            type="text"
            id="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Ex: Farinha de Trigo"
            required
          />
        </div>
        <div className="mb-6">
          <label htmlFor="unidadeDeMedida" className="block text-gray-700 text-sm font-bold mb-2">
            Unidade de Medida
          </label>
          <select
            id="unidadeDeMedida"
            value={unidadeDeMedida}
            onChange={(e) => setUnidadeDeMedida(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            <option value="g">Grama (g)</option>
            <option value="kg">Quilograma (kg)</option>
            <option value="ml">Mililitro (ml)</option>
            <option value="l">Litro (l)</option>
            <option value="unidade">Unidade</option>
          </select>
        </div>
        <div className="flex items-center justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          >
            Cadastrar Insumo
          </button>
        </div>
      </form>
    </div>
  );
}