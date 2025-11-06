"use client";

import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell,
  TableColumn, TableHeader, TableRow
} from "@heroui/table";

import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { selectVendas } from "../../actions/vendas";

export default function TabelaHistoricoVendas({ produtos }) {
  const [vendas, setVendas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ produtoId: "", dataInicio: "", dataFim: "" });

  const { data: session } = useSession();
  const userId = session?.user?.id;

  const loadVendas = async () => {
    if (!userId) return; // Não busca se o usuário não estiver carregado

    setLoading(true);
    try {
      const response = await selectVendas(userId, currentPage, 10, filters);
      if (response.success) {
        setVendas(response.data);
        setTotalPages(response.totalPages);
      } else {
        toast.error(response.message || 'Erro ao buscar histórico.');
      }
    } catch (error) {
      toast.error('Erro ao carregar histórico de vendas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVendas();
  }, [currentPage, userId]); // Recarrega com a paginação ou mudança de usuário

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1); // Reseta para a primeira página ao aplicar filtro
    loadVendas();
  };

  return (
    <div className="p-4 flex flex-col gap-4 w-full max-w-5xl mx-auto">
      <div className="bg-white p-4 rounded-lg shadow-md flex items-end gap-4 flex-wrap">
        <div className="flex-grow">
          <label className="block text-sm font-medium text-gray-700">Filtrar por Produto</label>
          <select
            name="produtoId"
            value={filters.produtoId}
            onChange={handleFilterChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          >
            <option value="">Todos os Produtos</option>
            {produtos.map(produto => (
              <option key={produto.id} value={produto.id}>
                {produto.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          {/* ... (campos de data continuam os mesmos) ... */}
        </div>
        <button onClick={applyFilters} className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-md">Filtrar</button>
      </div>

      <div className="overflow-x-auto">
        <Table isStriped aria-label="Tabela de Histórico de Vendas">
          <TableHeader>
            {/* Add width classes */}
            <TableColumn className="w-1/4">DATA DA VENDA</TableColumn>
            <TableColumn className="w-1/2">PRODUTO</TableColumn>
            <TableColumn className="w-1/8 text-center">QUANTIDADE</TableColumn>
            <TableColumn className="w-1/8 text-center">VALOR TOTAL (R$)</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"Nenhuma venda encontrada."}>
            {vendas.map((venda) => (
              <TableRow key={venda.id}>
                {/* Optionally add text alignment if needed */}
                <TableCell className="text-center">{venda.dataVenda}</TableCell>
                <TableCell className="text-center">{venda.produto.nome}</TableCell>
                <TableCell className="text-center">{venda.quantidadeVendida}</TableCell>
                <TableCell className="text-center">{venda.valorTotalVenda}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50" disabled={currentPage >= totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>
          Próxima
        </button>
      </div>
    </div>
  );
}