// REMOVA 'use client'. Esta página agora é um Server Component.

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import db from "../../../../prisma/db";
import FormCompraInsumo from "../../../components/forms/FormCompraInsumo";
import { options } from "@/app/api/auth/[...nextauth]/options";

// Função auxiliar para buscar os insumos do banco de dados
async function getInsumos(userId) {
  if (!userId) return []; // Retorna vazio se não houver usuário

  const insumos = await db.insumo.findMany({
    where: { userId: userId },
    select: {
      id: true,
      nome: true,
    },
    orderBy: {
      nome: 'asc'
    }
  });
  return insumos;
}

// A página é um Server Component assíncrono
export default async function CadastroCompraPage() {
  // 1. Obtém a sessão no lado do servidor
  const session = await getServerSession(options);

  // 2. Protege a rota: se não houver sessão, redireciona para o login
  if (!session) {
    redirect('/signin?callbackUrl=/cadastroCompra');
  }

  const userId = session?.user?.id;

  // 3. Busca os dados no servidor usando o ID do usuário
  const insumos = await getInsumos(userId);

  // 4. Renderiza o formulário (Client Component) passando os dados como props
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <FormCompraInsumo insumos={insumos} />
    </main>
  );
}