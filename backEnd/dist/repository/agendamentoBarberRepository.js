"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendamentoBarberRepository = void 0;
const prisma_1 = require("../prisma");
const AGENDAMENTOS_ATIVOS = [
    "AGENDADO",
    "CONFIRMADO",
];
class AgendamentoBarberRepository {
    buscarClienteDaEmpresa = async (clienteId, empresaId) => {
        return await prisma_1.prisma.cliente.findFirst({
            where: { id: clienteId, empresaId },
        });
    };
    buscarColaboradorDaEmpresa = async (colaboradorId, empresaId) => {
        return await prisma_1.prisma.colaborador.findFirst({
            where: { id: colaboradorId, empresaId },
        });
    };
    buscarServicoConfigDaEmpresa = async (servicoConfigId, empresaId) => {
        return await prisma_1.prisma.servicoConfig.findFirst({
            where: { id: servicoConfigId, empresaId, ativo: true },
        });
    };
    listarAgendamentosAtivosDoColaboradorNoPeriodo = async (empresaId, colaboradorId, inicio, fim) => {
        return await prisma_1.prisma.agendamento.findMany({
            where: {
                empresaId,
                colaboradorId,
                status: { in: AGENDAMENTOS_ATIVOS },
                start: { lt: fim },
                end: { gt: inicio },
            },
            orderBy: { start: "asc" },
        });
    };
    listarBloqueiosColaboradorNoPeriodo = async (empresaId, colaboradorId, inicio, fim) => {
        return await prisma_1.prisma.bloqueioAgenda.findMany({
            where: {
                empresaId,
                colaboradorId,
                start: { lt: fim },
                end: { gt: inicio },
            },
            orderBy: { start: "asc" },
        });
    };
    criarAgendamento = async (empresaId, agendamentoData) => {
        try {
            return await prisma_1.prisma.$transaction(async (tx) => {
                await tx.$executeRaw `
          SELECT id FROM "Colaborador"
          WHERE id = ${agendamentoData.colaboradorId}
          FOR UPDATE
        `;
                const conflito = await tx.agendamento.findFirst({
                    where: {
                        empresaId,
                        colaboradorId: agendamentoData.colaboradorId,
                        status: { in: AGENDAMENTOS_ATIVOS },
                        start: { lt: agendamentoData.end },
                        end: { gt: agendamentoData.start },
                    },
                });
                if (conflito) {
                    throw new Error("SLOT_OCUPADO");
                }
                return await tx.agendamento.create({
                    data: {
                        start: agendamentoData.start,
                        end: agendamentoData.end,
                        status: "AGENDADO",
                        clienteId: agendamentoData.clienteId,
                        colaboradorId: agendamentoData.colaboradorId,
                        servicoConfigId: agendamentoData.servicoConfigId,
                        empresaId,
                    },
                });
            });
        }
        catch (error) {
            console.error("Erro ao criar agendamento:", error);
            if (error instanceof Error && error.message === "SLOT_OCUPADO") {
                throw error;
            }
            throw new Error("Não foi possível criar o agendamento.");
        }
    };
    listarAgendamento = async (empresaId) => {
        try {
            return await prisma_1.prisma.agendamento.findMany({
                where: { empresaId },
                orderBy: { start: "asc" },
                include: {
                    Cliente: true,
                    Colaborador: true,
                    ServicoConfig: true,
                },
            });
        }
        catch (error) {
            console.error("Erro ao listar agendamentos:", error);
            throw new Error("Não foi possível listar os agendamentos.");
        }
    };
    deleteAgendamento = async (agendamentoId, empresaId) => {
        try {
            const deleted = await prisma_1.prisma.agendamento.deleteMany({
                where: { id: agendamentoId, empresaId },
            });
            if (deleted.count === 0) {
                throw new Error("NOT_FOUND");
            }
        }
        catch (error) {
            console.error("Erro ao deletar agendamento:", error);
            throw new Error("Não foi possível deletar o agendamento.");
        }
    };
}
exports.AgendamentoBarberRepository = AgendamentoBarberRepository;
