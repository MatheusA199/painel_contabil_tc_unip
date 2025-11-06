"use client";

// Este componente apenas exibe os dados que recebe
export default function DREDisplay({ dreData }) {
  if (!dreData) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl inset-shadow-2xs">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">DRE - Demonstrativo de Resultados</h2>
      <div className="space-y-2 text-lg">
        <div className="flex justify-between">
          <span className="text-gray-600">(+) Receita Bruta de Vendas</span>
          <span className="font-semibold text-green-600">R$ {dreData.receitaBruta}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="text-gray-600">(-) Custo da Mercadoria Vendida (CMV)</span>
          <span className="font-semibold text-red-600">(R$ {dreData.cmv})</span>
        </div>
        <div className="flex justify-between font-bold text-xl">
          <span className="text-gray-800">(=) Lucro Bruto</span>
          <span className={parseFloat(dreData.lucroBruto) >= 0 ? "text-blue-600" : "text-red-600"}>R$ {dreData.lucroBruto}</span>
        </div>
        <div className="flex justify-between border-b pb-2 pt-4">
          <span className="text-gray-600">(-) Despesas (Perdas)</span>
          <span className="font-semibold text-red-600">(R$ {dreData.despesas})</span>
        </div>
        <div className="flex justify-between font-bold text-2xl bg-gray-100 p-2 rounded">
          <span className="text-gray-900">(=) Lucro Líquido</span>
          <span className={parseFloat(dreData.lucroLiquido) >= 0 ? "text-green-700" : "text-red-700"}>R$ {dreData.lucroLiquido}</span>
        </div>
      </div>
    </div>
  );
}