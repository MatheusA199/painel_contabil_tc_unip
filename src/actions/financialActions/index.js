"use server";

import { Prisma } from "@prisma/client";
import db from "../../../prisma/db";

// --- Funções Auxiliares CORRIGIDAS ---

// Esta função agora calcula o custo unitário e multiplica pela quantidade desejada
export async function calcularCustoDeItens(produtoId, quantidadeDeItens) {
  // 1. Busca o produto para saber o rendimento da receita
  const produto = await db.produto.findUnique({ where: { id: produtoId } });
  if (!produto || !produto.rendimentoReceita) return new Prisma.Decimal(0);

  const receitaItens = await db.receitaItem.findMany({ where: { produtoId } });
  if (receitaItens.length === 0) return new Prisma.Decimal(0);

  // 2. Calcula o custo total para produzir UM LOTE
  let custoDoLote = new Prisma.Decimal(0);
  for (const item of receitaItens) {
    const agregacao = await db.compraInsumo.aggregate({
      _sum: { custoTotal: true, quantidadeComprada: true },
      where: { insumoId: item.insumoId },
    });
    const custoTotalComprado = agregacao._sum.custoTotal ?? new Prisma.Decimal(0);
    const qtdTotalComprada = agregacao._sum.quantidadeComprada ?? new Prisma.Decimal(0);

    if (qtdTotalComprada.isZero()) {
      // Lança um erro para interromper o cálculo se um insumo não tem custo
      throw new Error(`Insumo ID ${item.insumoId} não possui registro de compra.`);
    }

    const custoMedioInsumo = custoTotalComprado.div(qtdTotalComprada);
    custoDoLote = custoDoLote.add(item.quantidade.mul(custoMedioInsumo));
  }

  // 3. Calcula o custo UNITÁRIO
  const custoUnitario = custoDoLote.div(produto.rendimentoReceita);

  // 4. Retorna o custo para a quantidade de itens solicitada
  return custoUnitario.mul(quantidadeDeItens);
}

export async function calcularCustoMedioInsumo(insumoId, quantidade) {
  const agregacao = await db.compraInsumo.aggregate({
    _sum: { custoTotal: true, quantidadeComprada: true },
    where: { insumoId },
  });
  const custoTotal = agregacao._sum.custoTotal ?? new Prisma.Decimal(0);
  const qtdTotal = agregacao._sum.quantidadeComprada ?? new Prisma.Decimal(0);
  if (qtdTotal.isZero()) return new Prisma.Decimal(0);

  const custoMedio = custoTotal.div(qtdTotal);
  return custoMedio.mul(quantidade);
}

// --- Função Principal (getFinancialStatements) ---

export async function getFinancialStatements(userId, periodo) {
  if (!userId) {
    throw new Error("ID do usuário é obrigatório.");
  }

  try {

    const dateFilter = periodo?.startDate && periodo?.endDate
      ? {
        gte: new Date(periodo.startDate),
        lte: new Date(periodo.endDate + "T23:59:59.999Z"), // Inclui o dia todo
      }
      : undefined;


    const vendas = await db.venda.findMany({
      where: {
        userId,
        dataVenda: dateFilter, // 3. Aplica o filtro de data aqui
      },
    });
    const receitaBruta = vendas.reduce((acc, venda) => acc.add(venda.valorTotalVenda), new Prisma.Decimal(0));

    // b) Custo da Mercadoria Vendida (CMV)
    let cmvTotal = new Prisma.Decimal(0);
    for (const venda of vendas) { // O loop agora é sobre as vendas filtradas
      const custoVenda = await calcularCustoDeItens(venda.produtoId, venda.quantidadeVendida);
      cmvTotal = cmvTotal.add(custoVenda);
    }

    // c) Lucro Bruto
    const lucroBruto = receitaBruta.sub(cmvTotal);

    // d) Despesas com Perdas
    const perdas = await db.perda.findMany({
      where: {
        userId,
        dataPerda: dateFilter, // 4. Aplica o filtro de data aqui também
      },
    });
    let despesasComPerdas = new Prisma.Decimal(0);
    for (const perda of perdas) {
      let custoPerda = new Prisma.Decimal(0);
      if (perda.tipo === 'PRODUTO' && perda.produtoId) {
        custoPerda = await calcularCustoDeItens(perda.produtoId, perda.quantidade);
      } else if (perda.tipo === 'INSUMO' && perda.insumoId) {
        custoPerda = await calcularCustoMedioInsumo(perda.insumoId, perda.quantidade);
      }
      despesasComPerdas = despesasComPerdas.add(custoPerda);
    }

    // e) Lucro Líquido
    const lucroLiquido = lucroBruto.sub(despesasComPerdas);

    const dre = {
      receitaBruta: receitaBruta.toFixed(2),
      cmv: cmvTotal.toFixed(2),
      lucroBruto: lucroBruto.toFixed(2),
      despesas: despesasComPerdas.toFixed(2),
      lucroLiquido: lucroLiquido.toFixed(2),
    };

    return { dre };
  } catch (error) {
    console.error("Erro ao gerar DRE:", error);
    return {
      dre: {
        receitaBruta: '0.00', cmv: '0.00', lucroBruto: '0.00',
        despesas: '0.00', lucroLiquido: '0.00'
      }
    }
  }
}