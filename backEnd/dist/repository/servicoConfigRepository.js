"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicoConfingRepository = void 0;
const prisma_1 = require("../prisma");
class ServicoConfingRepository {
    registraServiceCatalago = async (dto, empresaId) => {
        const registra = await prisma_1.prisma.servicoConfig.create({
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
        const list = await prisma_1.prisma.servicoConfig.findMany({
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
        const servico = await prisma_1.prisma.servicoConfig.findFirst({
            where: {
                empresaId: empresaId,
                id: id
            }
        });
        if (!servico) {
            throw new Error("Não possivel encontra este servico");
        }
        return prisma_1.prisma.servicoConfig.delete({
            where: {
                id: id
            }
        });
    };
}
exports.ServicoConfingRepository = ServicoConfingRepository;
