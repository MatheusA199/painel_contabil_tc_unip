// This is a Server Component, so NO "use client"

import { options } from "@/app/api/auth/[...nextauth]/options";
import { getInsumosParaReceita } from "../../../actions/receitas";
import FormReceita from "../../../components/forms/FormReceita"; // Adjust path if needed
import { getServerSession } from "next-auth";

// The page is an 'async' function to allow data fetching
export default async function CadastroReceitaPage() {
 
  const [produtos, insumos] = await getInsumosParaReceita();
  console.log(produtos, insumos)
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      {/* 2. Pass the fetched data as props to the client component */}
      <FormReceita produtos={produtos} insumos={insumos} />
    </main>
  );
}