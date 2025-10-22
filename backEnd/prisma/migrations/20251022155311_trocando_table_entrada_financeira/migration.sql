/*
  Warnings:

  - You are about to drop the `ControleDeEntrada` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."ControleDeEntrada" DROP CONSTRAINT "ControleDeEntrada_servicoAssociadoId_fkey";

-- DropTable
DROP TABLE "public"."ControleDeEntrada";

-- CreateTable
CREATE TABLE "public"."GestaoFinanceira" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hora" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "formaDePagamento" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "colaboradorId" INTEGER NOT NULL,
    "servicoAssociadoId" INTEGER,

    CONSTRAINT "GestaoFinanceira_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."GestaoFinanceira" ADD CONSTRAINT "GestaoFinanceira_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "public"."Colaborador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GestaoFinanceira" ADD CONSTRAINT "GestaoFinanceira_servicoAssociadoId_fkey" FOREIGN KEY ("servicoAssociadoId") REFERENCES "public"."Servico"("id") ON DELETE SET NULL ON UPDATE CASCADE;
