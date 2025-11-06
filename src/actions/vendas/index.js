"use server";

import { Prisma } from "@prisma/client";
import db from "../../../prisma/db";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";


export async function registrarProducaoECalcularCusto(produtoId, quantidadeProduzida, userIdReceive) {
  const id = parseInt(produtoId);
  const qtdProduzida = parseInt(quantidadeProduzida);
  const userId = parseInt(userIdReceive);

  if (!id || !qtdProduzida || qtdProduzida <= 0) {
    return { success: false, message: "Dados de produção inválidos." };
  }

  try {
    const produto = await db.produto.findUnique({ where: { id } });
    if (!produto || !produto.rendimentoReceita) {
      return { success: false, message: "Produto ou rendimento da receita não encontrado." };
    }

    const receitaItens = await db.receitaItem.findMany({
      where: { produtoId: id },
      include: { insumo: true },
    });
    if (receitaItens.length === 0) {
      return { success: false, message: "Este produto não possui uma receita cadastrada." };
    }

    // ==================================================================
    // ETAPA 1: VERIFICAÇÃO DE ESTOQUE
    // ==================================================================
    const errosEstoque = [];
    const insumosNecessarios = [];

    for (const item of receitaItens) {
      // Calcula a quantidade de insumo necessária para a produção TOTAL
      const quantidadeNecessaria = new Prisma.Decimal(item.quantidade).mul(qtdProduzida).div(produto.rendimentoReceita);
      insumosNecessarios.push({ ...item, quantidadeNecessaria });

      // Calcula o estoque atual do insumo
      const entradas = await db.estoqueMovimentacao.aggregate({
        _sum: { quantidade: true },
        where: { insumoId: item.insumoId, tipo: 'ENTRADA' },
      });
      const saidas = await db.estoqueMovimentacao.aggregate({
        _sum: { quantidade: true },
        where: { insumoId: item.insumoId, tipo: 'SAIDA' },
      });

      const estoqueAtual = (entradas._sum.quantidade ?? 0) - (saidas._sum.quantidade ?? 0);

      // Compara o necessário com o disponível
      if (estoqueAtual < quantidadeNecessaria) {
        errosEstoque.push(`Estoque insuficiente para "${item.insumo.nome}". Necessário: ${quantidadeNecessaria}, Disponível: ${estoqueAtual}.`);
      }
    }

    // Se houver qualquer erro de estoque, interrompe a operação
    if (errosEstoque.length > 0) {
      return { success: false, message: "Não foi possível registrar a produção.", errors: errosEstoque };
    }

    // ==================================================================
    // ETAPA 2: CÁLCULO DE CUSTO (A lógica que já tínhamos)
    // ==================================================================
    let custoTotalDaProducao = new Prisma.Decimal(0);
    // ... (Lógica de cálculo de custo continua aqui, como estava antes)
    const custoUnitario = (await calcularCustoDeItens(id, 1)); // Usando uma função auxiliar para clareza
    custoTotalDaProducao = custoUnitario.mul(qtdProduzida);

    await db.$transaction(async (prisma) => {
      // a. Cria o registro da produção
      await prisma.producao.create({
        data: {
          produtoId: id,
          quantidadeProduzida: qtdProduzida,
          userId: userId,
        },
      });

      // b. Para cada insumo, cria a SAÍDA do estoque de matéria-prima
      for (const insumo of insumosNecessarios) {
        await prisma.estoqueMovimentacao.create({
          data: {
            tipo: 'SAIDA',
            insumoId: insumo.insumoId,
            quantidade: insumo.quantidadeNecessaria,
            descricao: `Produção de ${qtdProduzida}x "${produto.nome}"`,
          }
        });
      }

      // c. Cria a ENTRADA do produto acabado no estoque
      await prisma.estoqueMovimentacao.create({
        data: {
          tipo: 'ENTRADA',
          produtoId: id,
          quantidade: qtdProduzida,
          descricao: `Produção de ${qtdProduzida}x "${produto.nome}"`,
        }
      });
    });

    revalidatePath('/'); // Limpa o cache para atualizar o dashboard

    return {
      success: true,
      message: `Produção de ${qtdProduzida} unidades registrada!`,
      custoTotal: custoTotalDaProducao.toFixed(2),
    };

  } catch (error) {
    console.error("Erro ao registrar produção:", error);
    return { success: false, message: "Ocorreu um erro ao registrar a produção." };
  }
}

// Função auxiliar para cálculo de custo (pode ficar no mesmo arquivo)
async function calcularCustoDeItens(produtoId, quantidadeDeItens) {
  const produto = await db.produto.findUnique({ where: { id: produtoId } });
  if (!produto || !produto.rendimentoReceita) return new Prisma.Decimal(0);
  const receitaItens = await db.receitaItem.findMany({ where: { produtoId } });
  if (receitaItens.length === 0) return new Prisma.Decimal(0);
  let custoDoLote = new Prisma.Decimal(0);
  for (const item of receitaItens) {
    const agregacao = await db.compraInsumo.aggregate({
      _sum: { custoTotal: true, quantidadeComprada: true },
      where: { insumoId: item.insumoId },
    });
    const custoTotalComprado = agregacao._sum.custoTotal ?? new Prisma.Decimal(0);
    const qtdTotalComprada = agregacao._sum.quantidadeComprada ?? new Prisma.Decimal(0);
    if (qtdTotalComprada.isZero()) {
      throw new Error(`Insumo ID ${item.insumoId} não possui registro de compra.`);
    }
    const custoMedioInsumo = custoTotalComprado.div(qtdTotalComprada);
    custoDoLote = custoDoLote.add(item.quantidade.mul(custoMedioInsumo));
  }
  const custoUnitario = custoDoLote.div(produto.rendimentoReceita);
  return custoUnitario.mul(quantidadeDeItens);
}

// A função agora recebe 'prevState' e 'formData'
export async function registrarVenda(prevState, formData) {
  
  const session = await getServerSession(options);
  const userId = session?.user?.id;
  
  // Extraímos os dados do formData usando os 'name' dos inputs
  const produtoId = formData.get('produtoId');
  const quantidadeVendida = formData.get('quantidadeVendida');

  // Validação inicial
  const id = parseInt(produtoId);
  const qtd = parseInt(quantidadeVendida);

  if (!id || !qtd || qtd <= 0) {
    // Retornamos um objeto de erro que o useActionState vai capturar
    return { success: false, message: "Dados da venda inválidos." };
  }

  try {
    const produto = await db.produto.findUnique({ where: { id } });
    if (!produto) {
      return { success: false, message: "Produto não encontrado." };
    }

    const faturamento = produto.precoVenda.mul(qtd);

    // Lógica para calcular o CMV (Custo da Mercadoria Vendida)
    const receitaItens = await db.receitaItem.findMany({ where: { produtoId: id } });
    if (receitaItens.length === 0) {
      return { success: false, message: "Produto sem receita, impossível calcular CMV." }
    }

    let custoDeProducaoUnitario = new Prisma.Decimal(0);
    for (const item of receitaItens) {
      const agregacaoCustos = await db.compraInsumo.aggregate({
        _sum: { custoTotal: true, quantidadeComprada: true },
        where: { insumoId: item.insumoId },
      });
      const custoTotalComprado = agregacaoCustos._sum.custoTotal ?? new Prisma.Decimal(0);
      const qtdTotalComprada = agregacaoCustos._sum.quantidadeComprada ?? new Prisma.Decimal(0);
      if (qtdTotalComprada.isZero()) {
        return { success: false, message: `Insumo ID ${item.insumoId} sem compras.` };
      }
      const custoMedioInsumo = custoTotalComprado.div(qtdTotalComprada);
      custoDeProducaoUnitario = custoDeProducaoUnitario.add(item.quantidade.mul(custoMedioInsumo));
    }
    const cmvDaVenda = custoDeProducaoUnitario.mul(qtd);

    await db.$transaction(async (prisma) => {
      await prisma.venda.create({
        data: {
          produtoId: id,
          quantidadeVendida: qtd,
          valorTotalVenda: faturamento,
          userId: userId,
        },
      });

      await prisma.estoqueMovimentacao.create({
        data: {
          tipo: 'SAIDA',
          produtoId: id,
          quantidade: qtd,
          descricao: `Venda #${new Date().getTime()}`,
        }
      });
    });

    revalidatePath('/'); // Limpa o cache da HomePage para atualizar o dashboard

    return {
      success: true,
      message: "Venda registrada com sucesso!",
      faturamento: faturamento.toFixed(2),
      cmv: cmvDaVenda.toFixed(2),
      lucroBruto: faturamento.sub(cmvDaVenda).toFixed(2)
    };

  } catch (error) {
    console.error("Erro ao registrar venda:", error);
    return { success: false, message: "Ocorreu um erro ao registrar a venda." };
  }
}


export async function selectVendas(userId, currentPage, itemsPerPage, filters) {
  if (!userId) {
    return { success: false, message: "Usuário não autenticado." };
  }

  const offset = (currentPage - 1) * itemsPerPage;
  // MUDANÇA AQUI: Agora esperamos 'produtoId' em vez de 'produtoNome'
  const { produtoId, dataInicio, dataFim } = filters || {};

  try {
    const whereClause = {
      userId: userId,
      // MUDANÇA AQUI: A lógica do where agora filtra pelo ID do produto
      ...(produtoId && { produtoId: parseInt(produtoId) }),
      ...(dataInicio && dataFim && {
        dataVenda: {
          gte: new Date(dataInicio),
          lte: new Date(dataFim + "T23:59:59.999Z")
        }
      }),
    };

    // O resto da função continua igual...
    const vendas = await db.venda.findMany({
      skip: offset,
      take: itemsPerPage,
      orderBy: { dataVenda: 'desc' },
      where: whereClause,
      include: {
        produto: {
          select: { nome: true },
        },
      },
    });

    const totalVendas = await db.venda.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalVendas / itemsPerPage);

    const vendasSerializadas = vendas.map(venda => ({
      ...venda,
      valorTotalVenda: venda.valorTotalVenda.toString(),
      dataVenda: venda.dataVenda.toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
    }));

    return {
      success: true,
      data: vendasSerializadas,
      currentPage: currentPage,
      totalPages: totalPages,
    };

  } catch (error) {
    console.error('Erro ao buscar histórico de vendas:', error);
    return { success: false, message: 'Erro ao buscar o histórico de vendas!' };
  }
}