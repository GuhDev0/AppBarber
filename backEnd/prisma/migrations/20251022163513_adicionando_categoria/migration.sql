/*
  Warnings:

  - Added the required column `categoriaId` to the `GestaoFinanceira` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `GestaoFinanceira` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `GestaoFinanceira` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."GestaoFinanceira" ADD COLUMN     "categoriaId" INTEGER NOT NULL,
ADD COLUMN     "tipo" TEXT NOT NULL,
ADD COLUMN     "total" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "public"."Categoria" (
    "id" SERIAL NOT NULL,
    "nomeCategoria" TEXT NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."GestaoFinanceira" ADD CONSTRAINT "GestaoFinanceira_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "public"."Categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
