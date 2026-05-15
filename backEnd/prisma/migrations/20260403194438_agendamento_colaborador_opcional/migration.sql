-- DropForeignKey
ALTER TABLE "Agendamento" DROP CONSTRAINT "Agendamento_colaboradorId_fkey";

-- AlterTable
ALTER TABLE "Agendamento" ALTER COLUMN "colaboradorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "Colaborador"("id") ON DELETE SET NULL ON UPDATE CASCADE;
