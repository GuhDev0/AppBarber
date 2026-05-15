import { prisma } from "../prisma";
import { StatusAgendamento } from "@prisma/client";

export type AgendamentoCreateData = {
  start: Date;
  end: Date;
  clienteId: number;
  colaboradorId: number;
  servicoConfigId: number;
};

const AGENDAMENTOS_ATIVOS: StatusAgendamento[] = [
  "AGENDADO",
  "CONFIRMADO",
];

export class AgendamentoBarberRepository {
  buscarClienteDaEmpresa = async (clienteId: number, empresaId: number) => {
    return await prisma.cliente.findFirst({
      where: { id: clienteId, empresaId },
    });
  };

  buscarColaboradorDaEmpresa = async (
    colaboradorId: number,
    empresaId: number
  ) => {
    return await prisma.colaborador.findFirst({
      where: { id: colaboradorId, empresaId },
    });
  };

  buscarServicoConfigDaEmpresa = async (
    servicoConfigId: number,
    empresaId: number
  ) => {
    return await prisma.servicoConfig.findFirst({
      where: { id: servicoConfigId, empresaId, ativo: true },
    });
  };

  listarAgendamentosAtivosDoColaboradorNoPeriodo = async (
    empresaId: number,
    colaboradorId: number,
    inicio: Date,
    fim: Date
  ) => {
    return await prisma.agendamento.findMany({
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

  listarBloqueiosColaboradorNoPeriodo = async (
    empresaId: number,
    colaboradorId: number,
    inicio: Date,
    fim: Date
  ) => {
    return await prisma.bloqueioAgenda.findMany({
      where: {
        empresaId,
        colaboradorId,
        start: { lt: fim },
        end: { gt: inicio },
      },
      orderBy: { start: "asc" },
    });
  };

  criarAgendamento = async (
    empresaId: number,
    agendamentoData: AgendamentoCreateData
  ) => {
    try {
      return await prisma.$transaction(async (tx) => {
        await tx.$executeRaw`
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
    } catch (error: unknown) {
      console.error("Erro ao criar agendamento:", error);
      if (error instanceof Error && error.message === "SLOT_OCUPADO") {
        throw error;
      }
      throw new Error("Não foi possível criar o agendamento.");
    }
  };

  listarAgendamento = async (empresaId: number) => {
    try {
      return await prisma.agendamento.findMany({
        where: { empresaId },
        orderBy: { start: "asc" },
        include: {
          Cliente: true,
          Colaborador: true,
          ServicoConfig: true,
        },
      });
    } catch (error) {
      console.error("Erro ao listar agendamentos:", error);
      throw new Error("Não foi possível listar os agendamentos.");
    }
  };

  deleteAgendamento = async (agendamentoId: number, empresaId: number) => {
    try {
      const deleted = await prisma.agendamento.deleteMany({
        where: { id: agendamentoId, empresaId },
      });
      if (deleted.count === 0) {
        throw new Error("NOT_FOUND");
      }
    } catch (error: unknown) {
      console.error("Erro ao deletar agendamento:", error);
      throw new Error("Não foi possível deletar o agendamento.");
    }
  };
}
