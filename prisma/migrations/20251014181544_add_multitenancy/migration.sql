/*
  Warnings:

  - A unique constraint covering the columns `[userId,nome]` on the table `Insumo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,nome]` on the table `Produto` will be added. If there are existing duplicate values, this will fail.
  - Made the column `userId` on table `Perda` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Perda" DROP CONSTRAINT "Perda_userId_fkey";

-- DropIndex
DROP INDEX "Insumo_nome_key";

-- DropIndex
DROP INDEX "Produto_nome_key";

-- AlterTable
ALTER TABLE "EstoqueMovimentacao" ADD COLUMN     "userId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Insumo" ADD COLUMN     "userId" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "Perda" ALTER COLUMN "userId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Produto" ADD COLUMN     "userId" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Insumo_userId_nome_key" ON "Insumo"("userId", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "Produto_userId_nome_key" ON "Produto"("userId", "nome");

-- AddForeignKey
ALTER TABLE "Insumo" ADD CONSTRAINT "Insumo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Perda" ADD CONSTRAINT "Perda_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EstoqueMovimentacao" ADD CONSTRAINT "EstoqueMovimentacao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
