import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
export class PagamentoRepository {
    gerenciarPagamento = async (empresaId) => {
        const list = await prisma.servico.findMany({
            where: {
                empresaId: empresaId
            }, select: {
                valorDoServico: true,
                servicoConfig: {
                    select: {
                        comissao: true
                    }
                }, colaborador: {
                    select: {
                        nomeCompleto: true
                    }
                }
            }
        });
        const listaDeColaboradores = await prisma.colaborador.findMany({
            where: {
                empresaId
            }
        });
        const colaboradores = await listaDeColaboradores.length;
        const receitaTotalDosServiço = list.reduce((acc, s) => acc + s.valorDoServico, 0);
        const receitaTotalDescontadoComissao = list.reduce((acc, s) => acc + s.valorDoServico * (s.servicoConfig.comissao / 100), 0);
        const resultado = [
            {
                Receita_TOTAL_DOS_SERVICOS_Barbearia: receitaTotalDosServiço,
                Receita_TOTAL_DOS_SERVICOS_EmComissao_Barbearia: receitaTotalDescontadoComissao,
                Colaboradores: colaboradores
            }
        ];
        return resultado;
    };
    registrarPagamento = async (empresaId, colaboradId, servicoId) => {
        const [empresa, colaborador, servico] = await Promise.all([
            prisma.empresa.findUnique({ where: { id: empresaId } }),
            prisma.colaborador.findUnique({ where: { id: colaboradId } }),
            prisma.servico.findUnique({ where: { id: servicoId } }),
        ]);
        if (!empresa || !colaborador || !servico) {
            throw new Error("IDs inválidos: verifique se empresa, colaborador e serviço existem.");
        }
        const lancamento = await prisma.pagamento.create({
            data: {
                status: "PENDENTE",
                dataPagamento: new Date(),
                colaboradorId: colaboradId,
                empresaId: empresaId,
                servicoId: servicoId,
            },
        });
        return lancamento;
    };
    gerenciarPagamentoPorId = async (empresaId, colaboradorId) => {
        try {
            const listaDeServiçoPorId = await prisma.servico.findMany({
                where: {
                    empresaId: empresaId,
                    colaboradorId: colaboradorId
                }, include: {
                    servicoConfig: true,
                    colaborador: {
                        select: { nomeCompleto: true }
                    }
                }
            });
            const receita_total_comissao = listaDeServiçoPorId.reduce((acc, l) => acc + l.valorDoServico * l.servicoConfig.comissao / 100, 0);
            const receita_total = listaDeServiçoPorId.reduce((acc, l) => acc + l.valorDoServico, 0);
            const total_de_servicoRealizados = listaDeServiçoPorId.length;
            const colaboradorNome = await listaDeServiçoPorId[0]?.colaborador.nomeCompleto;
            const infoColaborador = {
                colaboradorNome,
                receita_total_comissao,
                total_de_servicoRealizados,
                receita_total
            };
            console.log(infoColaborador);
            return listaDeServiçoPorId;
        }
        catch (error) {
            throw new Error("Erro ao conectar ao banco", error.message);
        }
    };
}
//# sourceMappingURL=pagamentoRepository.js.map