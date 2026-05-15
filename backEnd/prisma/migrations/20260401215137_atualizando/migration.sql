/*
  Warnings:

  - You are about to drop the column `diaSemana` on the `Horario` table. All the data in the column will be lost.
  - Added the required column `dataDoAgendamento` to the `Agendamento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataDoBloqueio` to the `BloqueioAgenda` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DiaSemana" AS ENUM ('DOMINGO', 'SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO');

-- AlterTable
ALTER TABLE "Agendamento" ADD COLUMN     "dataDoAgendamento" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "BloqueioAgenda" ADD COLUMN     "dataDoBloqueio" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Horario" DROP COLUMN "diaSemana";

-- CreateTable
CREATE TABLE "HorarioDiaSemana" (
    "id" SERIAL NOT NULL,
    "diaSemana" "DiaSemana" NOT NULL,
    "horarioId" INTEGER NOT NULL,

    CONSTRAINT "HorarioDiaSemana_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HorarioDiaSemana" ADD CONSTRAINT "HorarioDiaSemana_horarioId_fkey" FOREIGN KEY ("horarioId") REFERENCES "Horario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
