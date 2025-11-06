"use client";

import { useEffect, useState } from "react";

import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";
import { getEstoqueInsumos } from "@/actions/managerInsumo";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

export default function TabelaEstoqueInsumos() {
  const [insumos, setInsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ nomeInsumo: "" });
  
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const loadEstoque = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const response = await getEstoqueInsumos(userId, currentPage, 15, filters);
      if (response.success) {
        setInsumos(response.data);
        setTotalPages(response.totalPages);
      } else {
        toast.error(response.message || 'Erro ao buscar estoque.');
      }
    } catch (error) {
      toast.error('Erro ao carregar estoque.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEstoque();
  }, [currentPage, userId]);

  const handleFilterChange = (e) => {
    setFilters({ nomeInsumo: e.target.value });
  };
  
  const applyFilters = () => {
    setCurrentPage(1);
    loadEstoque();
  };

  return (
    <div className="p-4 flex flex-col gap-4 w-full max-w-4xl mx-auto">

      <div className="overflow-x-auto">
        <Table isStriped aria-label="Tabela de Estoque de Insumos">
          <TableHeader>
            <TableColumn>INSUMO</TableColumn>
            <TableColumn>ESTOQUE ATUAL</TableColumn>
            <TableColumn>UNIDADE DE MEDIDA</TableColumn>
          </TableHeader>
          <TableBody emptyContent={"Nenhum insumo encontrado."}>
            {insumos.map((insumo) => (
              <TableRow key={insumo.id}>
                <TableCell className="text-center">{insumo.nome}</TableCell>
                <TableCell className="text-center">
                  <span className={parseFloat(insumo.estoqueAtual) <= 0 ? 'text-red-600 font-bold' : ''}>
                    {insumo.estoqueAtual}
                  </span>
                </TableCell>
                <TableCell className="text-center">{insumo.unidadeDeMedida}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center items-center gap-4 mt-4">
        <button className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)}>
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