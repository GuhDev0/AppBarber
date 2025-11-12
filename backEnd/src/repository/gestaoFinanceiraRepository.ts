import type { GestaoFinanceira, Categoria } from "@prisma/client";
import type { gestaoFinanceiraDto } from "../Dtos/gestaoFinanceiraDto.js";
import { prisma } from "../prisma.js";

export class GestaoFinanceiraDB {
  // Criar lançamento
  async criarLancamento(
    gtGto: gestaoFinanceiraDto,
    empresaId: number,
    categoriaId?: number
  ) {
    const createDB = await prisma.gestaoFinanceira.create({
      data: {
        descricao: gtGto.descricao,
        valor: gtGto.valor,
        formaDePagamento: gtGto.formaDePagamento,
        tipo: gtGto.tipo,
        hora: gtGto.hora,
        data: gtGto.data ?? new Date(),
        categoriaId: categoriaId ?? null,
        empresaId,
        colaboradorId: gtGto.colaboradorId ?? null,
        servicoAssociadoId: gtGto.servicoAssociadoId ?? null,
      },
      include: {
        categoria: true,
      },
    });

    return createDB;
  }

  // Listar lançamentos
  async listaDeLancamentos(empresaId: number) {
   const list = await prisma.gestaoFinanceira.findMany({
  where: { empresaId },
  include: { categoria: true },
});

return list.map((item: GestaoFinanceira & { categoria: Categoria | null }) => ({
  ...item,
  nomeCategoria: item.categoria?.nomeCategoria ?? "Sem Categoria",
}));


  }

  // Deletar lançamento
  async deleteLancamento(id: number) {
    const deleteLancamento = await prisma.gestaoFinanceira.delete({
      where: { id },
    });
    return deleteLancamento;
  }
}
