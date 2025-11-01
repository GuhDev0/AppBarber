import { PrismaClient } from "../../generated/prisma/index.js";
import { Empresa } from "./EmpresaRepository.js";
const prisma = new PrismaClient();
export class ServicoConfingRepository {
    registraServiceCatalago = async (dto, empresaId) => {
        const registra = await prisma.servicoConfig.create({
            data: {
                nome: dto.nome,
                preco: dto.preco,
                tipo: dto.tipo,
                comissao: dto.comissao,
                ativo: true,
                empresa: {
                    connect: { id: empresaId }
                }
            }
        });
        return registra;
    };
    buscarListaDeServico = async (empresaId) => {
        const list = await prisma.servicoConfig.findMany({
            where: {
                empresaId: empresaId,
            }
        });
        if (!list) {
            throw new Error("Não possivel encontra a lista");
        }
        return list;
    };
    deleteServico = async (empresaId, id) => {
        const servico = await prisma.servicoConfig.findFirst({
            where: {
                empresaId: empresaId,
                id: id
            }
        });
        if (!servico) {
            throw new Error("Não possivel encontra este servico");
        }
        return prisma.servicoConfig.delete({
            where: {
                id: id
            }
        });
    };
}
//# sourceMappingURL=servicoConfigRepository.js.map