"use client";
import { useRef } from "react";
import DownloadButton from "../DowloadButton";
import DREDisplay from "../DREDisplay";

export default function DashboardClient({ financialData }) {
  const contentRef = useRef(null);

  return (
    <div className="flex flex-col items-center justify-center">
      {/* O conteúdo que será impresso */}
      <div
        ref={contentRef}
        className="items-center justify-center flex flex-col bg-white p-6 rounded-lg shadow-md"
      >
        <DREDisplay dreData={financialData.dre} />
      </div>

      {/* O botão recebe o ref */}
      {/* <DownloadButton contentRef={contentRef} /> */}
    </div>
  );
}
