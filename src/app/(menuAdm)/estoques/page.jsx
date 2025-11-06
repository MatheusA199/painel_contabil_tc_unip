import TabelaEstoqueInsumos from "@/components/estoqueTable";

export default function EstoquePage() {
  return (
    <div className="w-full">
        <h1 className="text-center text-4xl sm:text-6xl text-[#61677A] font-bold my-12">
            Controle de Estoque de Insumos
        </h1>
        <TabelaEstoqueInsumos />
    </div>
  );
}