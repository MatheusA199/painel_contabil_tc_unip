import TabelaHistoricoVendas from "@/components/tabelaHstoricoVenda";
import { getAllProduts } from "@/actions/produtosActions";

export default async  function HistoricoVendasPage() {
  const produtos = await getAllProduts();
  return (
    <div className="w-full">
        <h1 className="text-center text-4xl sm:text-6xl text-[#61677A] font-bold my-12">
            Histórico de Vendas
        </h1>
        <TabelaHistoricoVendas produtos={produtos} />
    </div>
  );
}