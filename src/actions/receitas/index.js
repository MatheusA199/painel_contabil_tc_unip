"use server";

import { getServerSession } from "next-auth";
import db from "../../../prisma/db";
import { options } from "@/app/api/auth/[...nextauth]/options";



export async function saveReceita(produtoId, itens) {
  if (!produtoId || itens.length === 0) {
    return { success: false, message: "Produto e itens são obrigatórios." };
  }

  try {
    // Usamos uma transação para garantir que a operação seja atômica:
    // Ou tudo funciona, ou nada é salvo.
    await db.$transaction(async (prisma) => {

      await prisma.receitaItem.deleteMany({
        where: { produtoId: produtoId },
      });

      // 2. Cria os novos itens da receita.
      await prisma.receitaItem.createMany({
        data: itens.map(item => ({
          produtoId: produtoId,
          insumoId: item.insumoId,
          quantidade: item.quantidade,
        })),
      });
    });

    return { success: true, message: "Receita salva com sucesso!" };

  } catch (error) {
    console.error("Erro ao salvar receita:", error);
    return { success: false, message: "Ocorreu um erro ao salvar a receita." };
  }
}

export async function getInsumosParaReceita() {
  const session = await getServerSession(options);
  const userId = session?.user?.id;

  const produtos = await db.produto.findMany({
    where: { userId: userId },
    orderBy: { nome: 'asc' }
  });

  const produtosSerializados = produtos.map(produto => ({
    ...produto,
    precoVenda: produto.precoVenda.toString(), // Converte Decimal para string
  }));

  const insumos = await db.insumo.findMany({
    where: { userId: userId },
    orderBy: { nome: 'asc' }
  });

  const insumosSerializados = insumos.map(insumo => ({
    ...insumo,
    precoAtual: insumo.precoAtual.toString(), // Corrige aqui também
  }));

  console.log('Insumos buscados do DB:', insumosSerializados);
  console.log('Produtos Serializados:', produtosSerializados);

  return [produtosSerializados, insumosSerializados];
}
