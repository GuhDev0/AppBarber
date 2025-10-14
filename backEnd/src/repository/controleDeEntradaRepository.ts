import { PrismaClient } from "../../generated/prisma/index.js";
import type { ControleDeEntradaDTO } from "../Dtos/controleDeEntrada.js";

const prisma = new PrismaClient();

export class ControleDeEntradaDB {
  saveEntrada = async (controleDeEntradaDTO: ControleDeEntradaDTO) => {
    
    const save = await prisma.controleDeEntrada.create({
      data: {
        descricao: controleDeEntradaDTO.descricao,
        hora: controleDeEntradaDTO.hora,
        valor: controleDeEntradaDTO.valor,
        formaDePagamento: controleDeEntradaDTO.formaDePagamento,
        barbeiroResponsavel: controleDeEntradaDTO.barbeiroResponsavel ?? null,
        servicoAssociadoId: controleDeEntradaDTO.servicoAssociadoId ?? null,
      },  
    });

    return save;
  };

  

}
