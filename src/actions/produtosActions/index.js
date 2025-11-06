import { getServerSession } from "next-auth";
import db from "../../../prisma/db";
import { options } from "@/app/api/auth/[...nextauth]/options";


export async function getAllProduts() {
  const session = await getServerSession(options);
  const userId = session?.user?.id;
  const produtos = await db.produto.findMany({
    where: { userId: userId },
    select: {
      id: true,
      nome: true,
    },
    orderBy: { nome: 'asc' }
  });
  return produtos;
}
