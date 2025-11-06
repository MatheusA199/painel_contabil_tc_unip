import db from "../../../prisma/db"


export async function getEntradas() {
  // Compras de insumo e produção de produtos, entradas de estoque
  const compras = await db.compraInsumo.findMany({
    include: { insumo: true, user: true }
  })
  const producoes = await db.producao.findMany({
    include: { produto: true, user: true }
  })
  return { compras, producoes }
}

export async function getSaidas() {
  // Saídas: vendas e perdas (estoque vendido ou perdido/desperdiçado)
  const vendas = await db.venda.findMany({
    include: { produto: true, user: true }
  })
  const perdas = await db.perda.findMany({
    include: { produto: true, insumo: true, user: true }
  })
  return { vendas, perdas }
}

export async function getReceitas() {
  // Ingredientes de cada receita
  return await db.receitaItem.findMany({
    include: { produto: true, insumo: true }
  })
}
