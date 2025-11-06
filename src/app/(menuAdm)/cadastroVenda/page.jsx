import { getServerSession } from "next-auth";
import db from "../../../../prisma/db";
import FormVenda from "../../../components/forms/FormVenda";
import { options } from "@/app/api/auth/[...nextauth]/options";

async function getProdutos(userId) {
  if (!userId) return []; // Retorna vazio se não houver usuário

  const produtos = await db.produto.findMany({
    where: { userId: userId },
    orderBy: { nome: 'asc' }
  });
  // Lembre-se de serializar o campo Decimal!
  return produtos.map(p => ({
    ...p,
    precoVenda: p.precoVenda.toString()
  }));
}

export default async function CadastroVendaPage() {
  const session = await getServerSession(options);

  // 2. Protege a rota: se não houver sessão, redireciona para o login
  if (!session) {
    redirect('/signin?callbackUrl=/cadastroCompra');
  }

  const userId = session?.user?.id;
  const produtos = await getProdutos(userId);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <FormVenda produtos={produtos} />
    </main>
  );
}