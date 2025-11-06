"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import db from "../../../prisma/db";
import { calcularCustoDeItens, calcularCustoMedioInsumo } from "../financialActions";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

export async function registrarPerda(userId, prevState, formData) {

  // Extrair dados do formulário
  const tipo = formData.get('tipo'); // 'PRODUTO' ou 'INSUMO'
  const itemId = parseInt(formData.get('itemId'));
  const quantidade = parseFloat(formData.get('quantidade'));
  const motivo = formData.get('motivo');

  if (!tipo || !itemId || !quantidade || !motivo) {
    return { success: false, message: "Todos os campos são obrigatórios." };
  }

  try {
    let custoDaPerda = new Prisma.Decimal(0);
    let dadosParaCriarPerda = {
        userId,
        tipo,
        motivo,
        quantidade,
    };
    
    // Calcula o custo da perda e prepara os dados
    if (tipo === 'PRODUTO') {
      custoDaPerda = await calcularCustoDeItens(itemId, quantidade);
      dadosParaCriarPerda.produtoId = itemId;
    } else { // tipo === 'INSUMO'
      custoDaPerda = await calcularCustoMedioInsumo(itemId, quantidade);
      dadosParaCriarPerda.insumoId = itemId;
    }

    // Registra a perda e a movimentação de estoque em uma transação
    await db.$transaction(async (prisma) => {
      // 1. Cria o registro da perda
      await prisma.perda.create({ data: dadosParaCriarPerda });

      // 2. Cria a movimentação de PERDA no estoque
      await prisma.estoqueMovimentacao.create({
        data: {
          tipo: 'PERDA',
          produtoId: tipo === 'PRODUTO' ? itemId : null,
          insumoId: tipo === 'INSUMO' ? itemId : null,
          quantidade: quantidade,
          descricao: `Perda: ${motivo}`,
          userId: userId,
        }
      });
    });

    revalidatePath('/'); // Atualiza o cache do painel financeiro

    return { 
      success: true, 
      message: `Perda registrada com sucesso! Custo da perda: R$ ${custoDaPerda.toFixed(2)}`
    };

  } catch (error) {
    console.error("Erro ao registrar perda:", error);
    return { success: false, message: "Ocorreu um erro ao registrar a perda." };
  }
}