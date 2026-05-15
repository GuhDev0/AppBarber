"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendamentoBarberService = void 0;
const HttpError_1 = require("../errors/HttpError");
const agendamentoBarberRepository_1 = require("../repository/agendamentoBarberRepository");
const DURACAO_PADRAO_MIN = 40;
class AgendamentoBarberService {
    agendamentoBarberRepository = new agendamentoBarberRepository_1.AgendamentoBarberRepository();
    parseData(v) {
        const d = v instanceof Date ? v : new Date(v);
        if (Number.isNaN(d.getTime())) {
            throw new HttpError_1.HttpError("Data ou horário inválido.", 400);
        }
        return d;
    }
    criarAgendamento = async (empresaId, agendamentoData) => {
        const start = this.parseData(agendamentoData.startTime);
        if (!agendamentoData.clienteId || agendamentoData.clienteId <= 0) {
            throw new HttpError_1.HttpError("Cliente deve ser informado.", 400);
        }
        if (!agendamentoData.colaboradorId || agendamentoData.colaboradorId <= 0) {
            throw new HttpError_1.HttpError("Colaborador deve ser informado.", 400);
        }
        const servico = await this.agendamentoBarberRepository.buscarServicoConfigDaEmpresa(agendamentoData.servicoConfigId, empresaId);
        if (!servico) {
            throw new HttpError_1.HttpError("Serviço (catálogo) não encontrado para esta empresa.", 404);
        }
        let end;
        if (agendamentoData.endTime != null && agendamentoData.endTime !== "") {
            end = this.parseData(agendamentoData.endTime);
        }
        else {
            const minutos = servico.duracaoDoServico ?? DURACAO_PADRAO_MIN;
            end = new Date(start.getTime() + minutos * 60_000);
        }
        if (end <= start) {
            throw new HttpError_1.HttpError("O horário final deve ser depois do início.", 400);
        }
        const cliente = await this.agendamentoBarberRepository.buscarClienteDaEmpresa(agendamentoData.clienteId, empresaId);
        if (!cliente) {
            throw new HttpError_1.HttpError("Cliente não encontrado para esta empresa.", 404);
        }
        const colab = await this.agendamentoBarberRepository.buscarColaboradorDaEmpresa(agendamentoData.colaboradorId, empresaId);
        if (!colab) {
            throw new HttpError_1.HttpError("Colaborador não encontrado para esta empresa.", 404);
        }
        const createData = {
            start,
            end,
            clienteId: agendamentoData.clienteId,
            colaboradorId: agendamentoData.colaboradorId,
            servicoConfigId: agendamentoData.servicoConfigId,
        };
        try {
            return await this.agendamentoBarberRepository.criarAgendamento(empresaId, createData);
        }
        catch (err) {
            if (err instanceof Error) {
                if (err.message === "SLOT_OCUPADO") {
                    throw new HttpError_1.HttpError("Este horário já está ocupado. Escolha outro intervalo.", 409);
                }
            }
            console.error("Erro ao criar agendamento:", err);
            throw new HttpError_1.HttpError("Não foi possível criar o agendamento.", 500);
        }
    };
    listarAgendamento = async (empresaId) => {
        try {
            return await this.agendamentoBarberRepository.listarAgendamento(empresaId);
        }
        catch (error) {
            console.error("Erro ao listar agendamentos:", error);
            throw new Error("Não foi possível listar os agendamentos.");
        }
    };
    deleteAgendamento = async (agendamentoId, empresaId) => {
        try {
            await this.agendamentoBarberRepository.deleteAgendamento(agendamentoId, empresaId);
        }
        catch (error) {
            console.error("Erro ao deletar agendamento:", error);
            throw new Error("Não foi possível deletar o agendamento.");
        }
    };
}
exports.AgendamentoBarberService = AgendamentoBarberService;
