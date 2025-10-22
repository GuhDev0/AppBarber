import { PrismaClient } from "../../generated/prisma/index.js";
import type { gestaoFinanceiraDto } from "../Dtos/gestaoFinanceiraDto.js"

const prisma = new PrismaClient();

export class GestaoFinanceiraDB {
  criarLancamento = async (gtGto: gestaoFinanceiraDto,empresaId:number,categoriaId:number) => {
    const createDB = await prisma.gestaoFinanceira.create({
      data: {
        descricao: gtGto.descricao,
        valor: gtGto.valor,
        formaDePagamento: gtGto.formaDePagamento,
        tipo: gtGto.tipo,
        hora: gtGto.hora,
        data: gtGto.data ?? new Date(),
        categoriaId:categoriaId ?? null,
        empresaId,
        colaboradorId: gtGto.colaboradorId ?? null,
        servicoAssociadoId: gtGto.servicoAssociadoId ?? null,
      },
    });

    return createDB;
  };
  listaDeLancamentos = async(empresaId:number) =>{
    const list = await prisma.gestaoFinanceira.findMany(
      {
        where:{
          empresaId:empresaId
        }
      }
    )
    return list
  }
}

