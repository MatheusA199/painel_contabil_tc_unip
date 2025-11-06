import FormPerda from "@/components/forms/FormPerda";
import db from "../../../../prisma/db";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";

async function getData() {
  const produtos = await db.produto.findMany({
    orderBy: { nome: 'asc' },
    where: { userId: (await getServerSession(options))?.user?.id || 0 } // Filtra pelo userId do usuário logado
  }
  );
  const insumos = await db.insumo.findMany({
    orderBy: { nome: 'asc' },
    where: { userId: (await getServerSession(options))?.user?.id || 0 }
  });

  // Serializa os dados para passar para o Client Component
  const produtosSerializados = produtos.map(p => ({ ...p, precoVenda: p.precoVenda.toString() }));
  const insumosSerializados = insumos.map(i => ({ ...i, precoAtual: i.precoAtual.toString() }));

  return { produtos: produtosSerializados, insumos: insumosSerializados };
}

export default async function CadastroPerdaPage() {
  const { produtos, insumos } = await getData();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <FormPerda produtos={produtos} insumos={insumos} />
    </main>
  );
}