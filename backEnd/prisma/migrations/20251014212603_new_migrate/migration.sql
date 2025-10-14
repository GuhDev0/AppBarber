-- CreateTable
CREATE TABLE "public"."ControleDeEntrada" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hora" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "formaDePagamento" TEXT NOT NULL,
    "barbeiroResponsavel" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "servicoAssociadoId" INTEGER,

    CONSTRAINT "ControleDeEntrada_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ControleDeEntrada" ADD CONSTRAINT "ControleDeEntrada_servicoAssociadoId_fkey" FOREIGN KEY ("servicoAssociadoId") REFERENCES "public"."Servico"("id") ON DELETE SET NULL ON UPDATE CASCADE;
