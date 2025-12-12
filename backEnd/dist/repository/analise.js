"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analise = void 0;
const prisma_1 = require("../prisma");
class Analise {
    async analiseCompletaPorColaborador(empresaId, colaboradorId) {
        try {
            const list = await prisma_1.prisma.servico.findMany({
                where: { empresaId, colaboradorId },
                select: {
                    id: true,
                    valorDoServico: true,
                    data: true,
                    colaborador: { select: { nomeCompleto: true } },
                    servicoConfig: { select: { comissao: true, tipo: true } },
                },
            });
            const totalPorMes = {};
            // Agrupa por mês
            list.forEach((s) => {
                const data = new Date(s.data);
                const mes = `${data.getFullYear()}-${data.getMonth() + 1}`; // ex: "2025-12"
                const comissao = s.valorDoServico * (s.servicoConfig.comissao / 100);
                if (!totalPorMes[mes])
                    totalPorMes[mes] = 0;
                totalPorMes[mes] += comissao;
            });
            // --- Geral ---
            const receitaTotal = list.reduce((c, s) => c + s.valorDoServico, 0);
            const receitaTotalComComissao = list.reduce((c, s) => c + s.valorDoServico * (s.servicoConfig.comissao / 100), 0);
            const total_de_Servico = list.length;
            // --- Do dia 1 ao 15 ---
            const lista1a15 = list.filter(s => {
                const dia = new Date(s.data).getDate();
                return dia >= 1 && dia <= 15;
            });
            const valorTotal1a15 = lista1a15.reduce((c, s) => c + s.valorDoServico, 0);
            const valorTotalComissao1a15 = lista1a15.reduce((c, s) => c + s.valorDoServico * (s.servicoConfig.comissao / 100), 0);
            const totalDeServico1a15 = lista1a15.length;
            // --- Do dia 16 ao 30/31 ---
            const lista16a30 = list.filter(s => {
                const dia = new Date(s.data).getDate();
                return dia >= 16; // até o fim do mês
            });
            const lista16a30FiltradaPorTipo = lista16a30.filter(s => s.servicoConfig.tipo == "Pacote");
            const valorTotal16a30 = lista16a30.reduce((c, s) => c + s.valorDoServico, 0);
            const valorTotalComissao16a30 = lista16a30.reduce((c, s) => c + s.valorDoServico * (s.servicoConfig.comissao / 100), 0);
            const totalDeServico16a30 = lista16a30.length;
            const nome = list[0]?.colaborador?.nomeCompleto;
            console.log(lista16a30FiltradaPorTipo);
            return [{
                    nomeDoColaborador: nome,
                    valorTotal: receitaTotal,
                    valorTotalComissao: receitaTotalComComissao,
                    totalDeServicoRealizado: total_de_Servico,
                    valorTotal1a15,
                    valorTotalComissao1a15,
                    totalDeServico1a15,
                    valorTotal16a30,
                    valorTotalComissao16a30,
                    totalDeServico16a30,
                    totalPorMes,
                }];
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("Erro na análise:", error.message);
            }
            return [];
        }
    }
    analiseCompletaDoEstabelecimento = async (empresaId) => {
        try {
            const list = await prisma_1.prisma.servico.findMany({
                where: { empresaId },
                select: {
                    id: true,
                    valorDoServico: true,
                    data: true,
                    tipoDoServico: true,
                    hora: true,
                }
            });
            function formatDate(days) {
                const date = new Date();
                date.setDate(date.getDate() - days);
                date.setHours(0, 0, 0, 0);
                return date;
            }
            const date30days = formatDate(30);
            const listaDoultimos30DSerivcos = list.filter(servico => {
                const servicoDate = new Date(servico.data);
                return servicoDate >= date30days;
            });
            const totalDeServico30D = listaDoultimos30DSerivcos.length;
            const receitaTotal30D = listaDoultimos30DSerivcos.reduce((c, s) => c + s.valorDoServico, 0);
            const total_de_Servico = list.length;
            console.log("Serviços dos últimos 30 dias:", totalDeServico30D);
            console.log("Total de Serviços:", total_de_Servico);
            console.log("Receita Total:", receitaTotal30D);
            return {
                totalDeServico30D,
                receitaTotal30D,
                total_de_Servico,
                list
            };
        }
        catch (error) {
            console.error("Não foi possivel realizar a analise do estabelecimento", error.message);
            throw new Error(error.message);
        }
    };
}
exports.Analise = Analise;
