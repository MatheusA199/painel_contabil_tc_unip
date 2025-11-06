import FormProducao from "../../../components/forms/FormProducao";
import { selectProduto } from "../../../actions/managerProduct"; // Supondo que esta action busca os produtos

// 1. Transforme a função da página em 'async'
export default async function CadastroProducaoPage() {
  
  // 2. Busque os dados no servidor ANTES de renderizar
  const produtos = await selectProduto();

  // 3. Passe os dados como props para o formulário (que é um Client Component)
  return (
    <div className="flex justify-center items-center min-h-screen">
      <FormProducao produtosCadastrados={produtos} />
    </div>
  );
}