'use server'

import { options } from "@/app/api/auth/[...nextauth]/options";
import db from "../../../prisma/db";
import { getServerSession } from "next-auth/next";

export async function createProduto(prevState, formData) {
  const session = await getServerSession(options);
  const userId = session?.user?.id;
  const nome = formData.get('nome');
  const precoVenda = formData.get('precoVenda');
  const rendimentoReceita = formData.get('rendimentoReceita');

  if (!nome || !precoVenda || !rendimentoReceita) {
    return { message: 'Todos os campos são obrigatórios.' };
  }

  try {
    const produto = await db.produto.create({
      data: {
        nome,
        precoVenda: parseFloat(precoVenda),
        rendimentoReceita: parseInt(rendimentoReceita),
        userId: userId
      }
    });
    return { success: true, message: 'Produto criado!' };
  } catch (error) {
    return { message: 'Erro ao criar produto.' };
  }
}


export async function selectProduto() {
  const session = await getServerSession(options);
  const userId = session?.user?.id;
  try {
    const produtos = await db.produto.findMany({
      select: {
        id: true,
        nome: true,
        precoVenda: true,
      },
      where: { userId },
      orderBy: { nome: 'asc' }
    });

    // IMPORTANTE: Converta o Decimal para string antes de retornar
    const produtosSerializados = produtos.map(p => ({
      ...p,
      precoVenda: p.precoVenda.toString()
    }));

    return produtosSerializados;

  } catch (err) {
    console.error(err);
    // Em uma server action, é melhor lançar o erro ou retornar um objeto de erro
    return []; // Retorna um array vazio em caso de erro
  }
}