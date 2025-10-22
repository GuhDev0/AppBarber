import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
export class ControleDeEntradaDB {
    saveEntrada = async (controleDeEntradaDTO) => {
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
//# sourceMappingURL=controleDeEntradaRepository.js.map