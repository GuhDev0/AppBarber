/*
  Warnings:

  - You are about to drop the column `nomeCliente` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `GestaoFinanceira` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `empresaId` to the `Categoria` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sobrenome` to the `Cliente` table without a default value. This is not possible if the table is not empty.
  - Added the required column `empresaId` to the `GestaoFinanceira` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `formaDePagamento` on the `GestaoFinanceira` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `tipo` on the `GestaoFinanceira` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `clienteId` to the `Servico` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servicoConfigId` to the `Servico` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TipoFinanceiro" AS ENUM ('SAIDA');

-- CreateEnum
CREATE TYPE "public"."FormaPagamento" AS ENUM ('PIX', 'DINHEIRO', 'CARTAO');

-- CreateEnum
CREATE TYPE "public"."TipoDeServico" AS ENUM ('Pacote', 'Simples', 'Combo');

-- CreateEnum
CREATE TYPE "public"."StatusPagamento" AS ENUM ('PENDENTE', 'CANCELADO', 'PAGO');

-- DropForeignKey
ALTER TABLE "public"."GestaoFinanceira" DROP CONSTRAINT "GestaoFinanceira_categoriaId_fkey";

-- DropForeignKey
ALTER TABLE "public"."GestaoFinanceira" DROP CONSTRAINT "GestaoFinanceira_colaboradorId_fkey";

-- AlterTable
ALTER TABLE "public"."Categoria" ADD COLUMN     "empresaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Cliente" DROP COLUMN "nomeCliente",
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "sobrenome" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."GestaoFinanceira" DROP COLUMN "total",
ADD COLUMN     "empresaId" INTEGER NOT NULL,
DROP COLUMN "formaDePagamento",
ADD COLUMN     "formaDePagamento" "public"."FormaPagamento" NOT NULL,
ALTER COLUMN "colaboradorId" DROP NOT NULL,
ALTER COLUMN "categoriaId" DROP NOT NULL,
DROP COLUMN "tipo",
ADD COLUMN     "tipo" "public"."TipoFinanceiro" NOT NULL;

-- AlterTable
ALTER TABLE "public"."Servico" ADD COLUMN     "clienteId" INTEGER NOT NULL,
ADD COLUMN     "servicoConfigId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."ServicoConfig" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "public"."TipoDeServico" NOT NULL,
    "preco" DOUBLE PRECISION NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "comissao" DOUBLE PRECISION NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "ServicoConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Pagamento" (
    "id" TEXT NOT NULL,
    "servicoId" INTEGER NOT NULL,
    "status" "public"."StatusPagamento" NOT NULL,
    "dataPagamento" TIMESTAMP(3) NOT NULL,
    "observacoes" TEXT,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ServicoConfig_nome_key" ON "public"."ServicoConfig"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_email_key" ON "public"."Cliente"("email");

-- AddForeignKey
ALTER TABLE "public"."GestaoFinanceira" ADD CONSTRAINT "GestaoFinanceira_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "public"."Categoria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GestaoFinanceira" ADD CONSTRAINT "GestaoFinanceira_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "public"."Colaborador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GestaoFinanceira" ADD CONSTRAINT "GestaoFinanceira_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Categoria" ADD CONSTRAINT "Categoria_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Servico" ADD CONSTRAINT "Servico_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "public"."Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Servico" ADD CONSTRAINT "Servico_servicoConfigId_fkey" FOREIGN KEY ("servicoConfigId") REFERENCES "public"."ServicoConfig"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ServicoConfig" ADD CONSTRAINT "ServicoConfig_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "public"."Empresa"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Pagamento" ADD CONSTRAINT "Pagamento_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "public"."Servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
