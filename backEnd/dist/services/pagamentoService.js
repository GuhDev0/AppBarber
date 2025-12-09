"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagamentoService = void 0;
const pagamento_1 = require("../repository/pagamento");
const serviceReposity_1 = require("../repository/serviceReposity");
const colaboradorService_1 = require("./colaboradorService");
const serviceReposity = new serviceReposity_1.ServiceRepository();
const colaboradorService = new colaboradorService_1.ColaboradorService();
class PagamentoService {
    createPagamento = async (empresaId) => {
        try {
            const listaDeColaboradores = await colaboradorService.buscarListaDeColaboradoresService(empresaId);
            const primeiroServico = await serviceReposity.findServicePrimeiraData(empresaId);
            if (!primeiroServico) {
                throw new Error("Nenhum serviço encontrado para esta empresa.");
            }
            const diasFixos = [15, 30];
            const agora = new Date();
            const diaHoje = new Date().getDate();
            const mes = agora.getMonth();
            const ano = agora.getFullYear();
            // if (!diasFixos.includes(diaHoje)) {
            //     throw new Error("O fechamento só pode ser feito no dia 15 ou 30.");
            // }
            const inicioPeriodo = diaHoje === 15
                ? new Date(ano, mes, 1)
                : new Date(ano, mes, 16);
            const fimPeriodo = diaHoje === 15
                ? new Date(ano, mes, 15)
                : new Date(ano, mes, 30);
            const dataDePagamento = diaHoje === 15
                ? new Date(ano, mes, 15)
                : new Date(ano, mes, 30);
            console.log("Período:", inicioPeriodo, fimPeriodo);
            for (const colaborador of listaDeColaboradores) {
                const servicosValidos = colaborador.servicos.filter(servico => {
                    const data = new Date(servico.data);
                    return data >= inicioPeriodo && data <= fimPeriodo;
                });
                const total = servicosValidos.reduce((acc, s) => acc + s.valorDoServico, 0);
                if (total === 0)
                    continue;
                const pagamentoDto = {
                    nomeDoColaborador: colaborador.nomeCompleto,
                    valorTotalDoPagamento: total,
                    dataDePagamento: dataDePagamento,
                    status: "PENDENTE",
                    colaboradorId: colaborador.id,
                    empresaId: empresaId,
                    descontos: 0
                };
                console.log(pagamentoDto);
                const pagamentoRepo = new pagamento_1.PagamentoRepository(pagamentoDto);
                await pagamentoRepo.createPagamento(empresaId);
            }
            return { msg: "Fechamento gerado com sucesso." };
        }
        catch (error) {
            console.error("Erro ao criar pagamento:", error.message);
            throw new Error(error.message);
        }
    };
}
exports.PagamentoService = PagamentoService;
