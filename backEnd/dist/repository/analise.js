import { prisma } from "../prisma.js";
export class Analise {
    async analiseCompletaPorColaborador(empresaId, colaboradorId) {
        try {
            const list = await prisma.servico.findMany({
                where: { empresaId, colaboradorId },
                select: {
                    id: true,
                    valorDoServico: true,
                    clienteId: true,
                    data: true,
                    colaborador: { select: { nomeCompleto: true } },
                    servicoConfig: { select: { comissao: true } },
                },
            });
            if (list.length === 0) {
                return [
                    {
                        nomeDoColaborador: "Sem serviços",
                        valorTotal: 0,
                        valorTotalComissao: 0,
                        totalDeServicoRealizado: 0,
                    },
                ];
            }
            const receitaTotal = list.reduce((c, s) => c + s.valorDoServico, 0);
            const receitaTotalComComissao = list.reduce((c, s) => c + s.valorDoServico * (s.servicoConfig.comissao / 100), 0);
            const total_de_Servico = list.length;
            const nome = list[0]?.colaborador?.nomeCompleto;
            return [
                {
                    nomeDoColaborador: nome,
                    valorTotal: receitaTotal,
                    valorTotalComissao: receitaTotalComComissao,
                    totalDeServicoRealizado: total_de_Servico,
                },
            ];
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Erro na análise:", error.message);
            }
            return [];
        }
    }
}
