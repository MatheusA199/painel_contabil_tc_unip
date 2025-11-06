"use client";


import { useReactToPrint } from "react-to-print";

export default function DownloadButton({ contentRef }) {
  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: "relatorio-financeiro",
  });

  return (
    <button
      onClick={handlePrint} // ❌ NÃO colocar .then()
      className="mt-6 bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
    >
      Baixar Relatório em PDF
    </button>
  );
}
