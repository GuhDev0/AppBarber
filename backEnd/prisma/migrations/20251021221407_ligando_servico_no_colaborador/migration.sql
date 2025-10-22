/*
  Warnings:

  - Added the required column `colaboradorId` to the `Servico` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Servico" ADD COLUMN     "colaboradorId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Servico" ADD CONSTRAINT "Servico_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "public"."Colaborador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
