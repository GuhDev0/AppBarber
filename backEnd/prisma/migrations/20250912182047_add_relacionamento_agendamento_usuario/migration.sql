-- CreateTable
CREATE TABLE "public"."Agendamento" (
    "id" SERIAL NOT NULL,
    "valorDoServico" DECIMAL(10,2) NOT NULL,
    "tipoDoServico" TEXT NOT NULL,
    "tempoDoServico" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Agendamento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Agendamento" ADD CONSTRAINT "Agendamento_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
