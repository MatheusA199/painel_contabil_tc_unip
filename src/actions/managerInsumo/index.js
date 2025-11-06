'use server'
import { getServerSession } from "next-auth";
import db from "../../../prisma/db";
import { Prisma } from "@prisma/client";
import { options } from "@/app/api/auth/[...nextauth]/options";

export async function saveInsumo(nome, unidadeDeMedida) {
  const session = await getServerSession(options);
  const userId = session?.user?.id;
  if (!userId) return { success: false, message: 'Usuário não autenticado.' };

  const novoInsumo = await db.Insumo.create({
    data: {
      nome: nome,
      unidadeDeMedida: unidadeDeMedida,
      userId: userId
    }
  });

  // CORREÇÃO: Crie um objeto simples e serialize o Decimal
  const insumoSerializado = {
    ...novoInsumo,
    precoAtual: novoInsumo.precoAtual.toString(),
  };

  return { success: true, data: insumoSerializado };
}

export async function getEstoqueInsumos(userId, currentPage, itemsPerPage, filters) {
  if (!userId) {
    return { success: false, message: "Usuário não autenticado." };
  }

  const offset = (currentPage - 1) * itemsPerPage;
  const { nomeInsumo } = filters || {};

  try {
    const whereClause = {
      userId: userId,
      ...(nomeInsumo && { nome: { contains: nomeInsumo, mode: 'insensitive' } }),
    };

    const insumos = await db.insumo.findMany({
      skip: offset,
      take: itemsPerPage,
      where: whereClause,
      orderBy: { nome: 'asc' },
    });

    const totalInsumos = await db.insumo.count({ where: whereClause });
    const totalPages = Math.ceil(totalInsumos / itemsPerPage);

    const insumosComEstoque = [];
    for (const insumo of insumos) {
      const movimentacoes = await db.estoqueMovimentacao.groupBy({
        by: ['tipo'],
        where: { insumoId: insumo.id },
        _sum: { quantidade: true },
      });

      let entradas = new Prisma.Decimal(0);
      let saidas = new Prisma.Decimal(0);

      movimentacoes.forEach(mov => {
        const quantidade = mov._sum.quantidade ?? 0;
        if (mov.tipo === 'ENTRADA') {
          entradas = entradas.add(quantidade);
        } else {
          saidas = saidas.add(quantidade);
        }
      });

      const estoqueAtual = entradas.sub(saidas);

      // CORREÇÃO: Converta 'precoAtual' para string ao construir o objeto
      insumosComEstoque.push({
        ...insumo,
        precoAtual: insumo.precoAtual.toString(), // <-- Adicione esta linha
        estoqueAtual: estoqueAtual.toString(),
      });
    }

    return {
      success: true,
      data: insumosComEstoque,
      currentPage: currentPage,
      totalPages: totalPages,
    };

  } catch (error) {
    console.error('Erro ao buscar estoque de insumos:', error);
    return { success: false, message: 'Erro ao buscar o estoque!' };
  }
}