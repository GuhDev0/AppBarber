import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
export class Analise {
    analiseCompletaPorColaborador = async (empresaId, colaboradorId) => {
        try {
            const list = await prisma.servico.findMany({
                where: {
                    empresaId: empresaId,
                    colaboradorId: colaboradorId
                }, select: {
                    id: true,
                    valorDoServico: true,
                    clienteId: true,
                    data: true,
                    colaborador: {
                        select: {
                            nomeCompleto: true,
                        }
                    },
                    servicoConfig: {
                        select: {
                            comissao: true
                        }
                    }
                },
            });
            const receitaTotal = list.reduce((c, s) => c + s.valorDoServico, 0);
            const receitaTotalComComissao = list.reduce((c, s) => c + s.valorDoServico * (s.servicoConfig.comissao / 100), 0);
            const total_de_Servico = list.length;
            const nome = list[0]?.colaborador.nomeCompleto;
            const analisePorColaborador = [
                {
                    nomeDoColaborador: nome,
                    valorTotal: receitaTotal,
                    valorTotalComissao: receitaTotalComComissao,
                    totalDeServicoRealizado: total_de_Servico
                },
            ];
            return analisePorColaborador;
        }
        catch (error) {
            console.error(error.message);
        }
    };
}
//# sourceMappingURL=analise.js.map