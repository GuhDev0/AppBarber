/*
  Warnings:

  - You are about to drop the column `dataDoAgendamento` on the `Agendamento` table. All the data in the column will be lost.
  - You are about to drop the column `dataDoBloqueio` on the `BloqueioAgenda` table. All the data in the column will be lost.
  - You are about to drop the `HorarioDiaSemana` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Horario" DROP CONSTRAINT "Horario_colaboradorId_fkey";

-- DropForeignKey
ALTER TABLE "HorarioDiaSemana" DROP CONSTRAINT "HorarioDiaSemana_horarioId_fkey";

-- AlterTable
ALTER TABLE "Agendamento" DROP COLUMN "dataDoAgendamento";

-- AlterTable
ALTER TABLE "BloqueioAgenda" DROP COLUMN "dataDoBloqueio";

-- AlterTable
ALTER TABLE "Horario" ADD COLUMN     "diaSemana" "DiaSemana"[],
ALTER COLUMN "colaboradorId" DROP NOT NULL;

-- DropTable
DROP TABLE "HorarioDiaSemana";

-- AddForeignKey
ALTER TABLE "Horario" ADD CONSTRAINT "Horario_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "Colaborador"("id") ON DELETE SET NULL ON UPDATE CASCADE;
