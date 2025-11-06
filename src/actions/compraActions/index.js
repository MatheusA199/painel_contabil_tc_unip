"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import db from "../../../prisma/db";

const compraSchema = z.object({
  insumoId: z.coerce.number().int().positive("Selecione um insumo."),
  quantidadeComprada: z.coerce.number().positive("A quantidade deve ser maior que zero."),
  custoTotal: z.coerce.number().positive("O custo total deve ser maior que zero."),
  dataCompra: z.coerce.date(),
});

// 1. Atualize a assinatura da função para receber o userId
// Os argumentos 'bind' vêm primeiro, seguidos pelos de 'useActionState'
export async function registrarCompraInsumo(userId, prevState, formData) {
  if (!userId) {
    return { message: "Erro: Usuário não autenticado." };
  }

  const result = compraSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    // A validação do Zod já retorna um objeto de erro bom o suficiente
    return result.error.flatten().fieldErrors;
  }

  const data = result.data;

  try {
    const precoUnitario = data.custoTotal / data.quantidadeComprada;

    await db.$transaction(async (prisma) => {
      await prisma.compraInsumo.create({
        data: {
          insumoId: data.insumoId,
          quantidadeComprada: data.quantidadeComprada,
          custoTotal: data.custoTotal,
          precoUnitario: precoUnitario,
          dataCompra: data.dataCompra,
          userId: userId, // 2. Use o userId recebido em vez de um valor fixo
        },
      });
      await prisma.estoqueMovimentacao.create({
        data: {
          tipo: 'ENTRADA',
          insumoId: data.insumoId,
          quantidade: data.quantidadeComprada,
          descricao: `Compra #${new Date().getTime()}`,
        },
      });
    });

    revalidatePath("/cadastroCompra");
    return { success: true, message: "Compra registrada com sucesso!" };
  } catch (error) {
    console.error("Erro ao registrar compra:", error);
    return { success: false, message: "Ocorreu um erro no servidor." };
  }
}