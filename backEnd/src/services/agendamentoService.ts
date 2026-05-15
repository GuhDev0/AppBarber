import { agendamentoDto } from "../Dtos/agendamento";
import { HttpError } from "../errors/HttpError";
import {
  AgendamentoBarberRepository,
  AgendamentoCreateData,
} from "../repository/agendamentoBarberRepository";

const DURACAO_PADRAO_MIN = 40;

export class AgendamentoBarberService {
  private agendamentoBarberRepository = new AgendamentoBarberRepository();

  private parseData(v: Date | string): Date {
    const d = v instanceof Date ? v : new Date(v);
    if (Number.isNaN(d.getTime())) {
      throw new HttpError("Data ou horário inválido.", 400);
    }
    return d;
  }

  criarAgendamento = async (empresaId: number, agendamentoData: agendamentoDto) => {
    const start = this.parseData(agendamentoData.startTime);

    if (!agendamentoData.clienteId || agendamentoData.clienteId <= 0) {
      throw new HttpError("Cliente deve ser informado.", 400);
    }

    if (!agendamentoData.colaboradorId || agendamentoData.colaboradorId <= 0) {
      throw new HttpError("Colaborador deve ser informado.", 400);
    }

    const servico = await this.agendamentoBarberRepository.buscarServicoConfigDaEmpresa(
      agendamentoData.servicoConfigId,
      empresaId
    );
    if (!servico) {
      throw new HttpError("Serviço (catálogo) não encontrado para esta empresa.", 404);
    }

    let end: Date;
    if (agendamentoData.endTime != null && agendamentoData.endTime !== "") {
      end = this.parseData(agendamentoData.endTime);
    } else {
      const minutos = servico.duracaoDoServico ?? DURACAO_PADRAO_MIN;
      end = new Date(start.getTime() + minutos * 60_000);
    }

    if (end <= start) {
      throw new HttpError("O horário final deve ser depois do início.", 400);
    }

    const cliente = await this.agendamentoBarberRepository.buscarClienteDaEmpresa(
      agendamentoData.clienteId,
      empresaId
    );
    if (!cliente) {
      throw new HttpError("Cliente não encontrado para esta empresa.", 404);
    }

    const colab = await this.agendamentoBarberRepository.buscarColaboradorDaEmpresa(
      agendamentoData.colaboradorId,
      empresaId
    );
    if (!colab) {
      throw new HttpError("Colaborador não encontrado para esta empresa.", 404);
    }

    const createData: AgendamentoCreateData = {
      start,
      end,
      clienteId: agendamentoData.clienteId,
      colaboradorId: agendamentoData.colaboradorId,
      servicoConfigId: agendamentoData.servicoConfigId,
    };

    try {
      return await this.agendamentoBarberRepository.criarAgendamento(
        empresaId,
        createData
      );
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message === "SLOT_OCUPADO") {
          throw new HttpError(
            "Este horário já está ocupado. Escolha outro intervalo.",
            409
          );
        }
      }
      console.error("Erro ao criar agendamento:", err);
      throw new HttpError("Não foi possível criar o agendamento.", 500);
    }
  };

  listarAgendamento = async (empresaId: number) => {
    try {
      return await this.agendamentoBarberRepository.listarAgendamento(empresaId);
    } catch (error) {
      console.error("Erro ao listar agendamentos:", error);
      throw new Error("Não foi possível listar os agendamentos.");
    }
  };

  deleteAgendamento = async (agendamentoId: number, empresaId: number) => {
    try {
      await this.agendamentoBarberRepository.deleteAgendamento(
        agendamentoId,
        empresaId
      );
    } catch (error) {
      console.error("Erro ao deletar agendamento:", error);
      throw new Error("Não foi possível deletar o agendamento.");
    }
  };
}
