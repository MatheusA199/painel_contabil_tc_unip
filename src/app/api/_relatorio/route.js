import { getEntradas, getReceitas, getSaidas } from "@/app/controllers";
import { NextResponse } from 'next/server';
export default async function GET(res) {
  // Obtenha as entradas de insumos, produções, vendas, perdas etc.
  const entradas = await getEntradas();
  const saídas = await getSaidas();
  const receitas = await getReceitas();
  // Calcule CMV, lucro, perdas, gastos etc. conforme CPC 16
  // retorne objeto estruturado para exibir na interface de demonstração financeira
  res.status(200).json({ entradas, saídas, receitas });
}
