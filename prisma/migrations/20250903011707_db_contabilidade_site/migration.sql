/*
  Warnings:

  - Added the required column `precoUnitario` to the `CompraInsumo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `CompraInsumo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Producao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Venda` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoMov" AS ENUM ('ENTRADA', 'SAIDA', 'PERDA', 'AJUSTE');

-- AlterTable
ALTER TABLE "CompraInsumo" ADD COLUMN     "precoUnitario" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Insumo" ADD COLUMN     "precoAtual" DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE "Perda" ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "Producao" ADD COLUMN     "lote" TEXT,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Venda" ADD COLUMN     "lote" TEXT,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "EstoqueMovimentacao" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoMov" NOT NULL,
    "produtoId" INTEGER,
    "insumoId" INTEGER,
    "quantidade" DECIMAL(10,3) NOT NULL,
    "descricao" TEXT,
    "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EstoqueMovimentacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CompraInsumo" ADD CONSTRAINT "CompraInsumo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producao" ADD CONSTRAINT "Producao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perda" ADD CONSTRAINT "Perda_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstoqueMovimentacao" ADD CONSTRAINT "EstoqueMovimentacao_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstoqueMovimentacao" ADD CONSTRAINT "EstoqueMovimentacao_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "Insumo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

