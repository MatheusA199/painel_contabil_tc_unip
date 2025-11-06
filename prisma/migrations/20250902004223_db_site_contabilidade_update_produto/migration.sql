/*
  Warnings:

  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "TipoPerda" AS ENUM ('INSUMO', 'PRODUTO');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "password" SET NOT NULL;

-- CreateTable
CREATE TABLE "Insumo" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "unidadeDeMedida" TEXT NOT NULL,

    CONSTRAINT "Insumo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "precoVenda" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceitaItem" (
    "produtoId" INTEGER NOT NULL,
    "insumoId" INTEGER NOT NULL,
    "quantidade" DECIMAL(10,3) NOT NULL,

    CONSTRAINT "ReceitaItem_pkey" PRIMARY KEY ("produtoId","insumoId")
);

-- CreateTable
CREATE TABLE "CompraInsumo" (
    "id" SERIAL NOT NULL,
    "insumoId" INTEGER NOT NULL,
    "quantidadeComprada" DECIMAL(10,3) NOT NULL,
    "custoTotal" DECIMAL(10,2) NOT NULL,
    "dataCompra" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompraInsumo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Producao" (
    "id" SERIAL NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidadeProduzida" INTEGER NOT NULL,
    "dataProducao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Producao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venda" (
    "id" SERIAL NOT NULL,
    "produtoId" INTEGER NOT NULL,
    "quantidadeVendida" INTEGER NOT NULL,
    "valorTotalVenda" DECIMAL(10,2) NOT NULL,
    "dataVenda" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Venda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Perda" (
    "id" SERIAL NOT NULL,
    "tipo" "TipoPerda" NOT NULL,
    "motivo" TEXT NOT NULL,
    "quantidade" DECIMAL(10,3) NOT NULL,
    "dataPerda" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "insumoId" INTEGER,
    "produtoId" INTEGER,

    CONSTRAINT "Perda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Insumo_nome_key" ON "Insumo"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Produto_nome_key" ON "Produto"("nome");

-- AddForeignKey
ALTER TABLE "ReceitaItem" ADD CONSTRAINT "ReceitaItem_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceitaItem" ADD CONSTRAINT "ReceitaItem_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompraInsumo" ADD CONSTRAINT "CompraInsumo_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "Insumo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Producao" ADD CONSTRAINT "Producao_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venda" ADD CONSTRAINT "Venda_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perda" ADD CONSTRAINT "Perda_insumoId_fkey" FOREIGN KEY ("insumoId") REFERENCES "Insumo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perda" ADD CONSTRAINT "Perda_produtoId_fkey" FOREIGN KEY ("produtoId") REFERENCES "Produto"("id") ON DELETE SET NULL ON UPDATE CASCADE;
