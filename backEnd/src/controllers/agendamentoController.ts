import { AgendamentoBarberService } from "../services/agendamentoService";
import { HttpError } from "../errors/HttpError";

export class AgendamentoBarberController {
  private agendamentoBarberService = new AgendamentoBarberService();

  criarAgendamento = async (req: any, res: any) => {
    if (!req.user) {
      return res.status(401).json({ mensagem: "Token inválido" });
    }
    try {
      const agendamento = await this.agendamentoBarberService.criarAgendamento(
        req.user.empresaId,
        req.body
      );
      return res.status(201).json(agendamento);
    } catch (error: unknown) {
      if (error instanceof HttpError) {
        return res.status(error.statusCode).json({ mensagem: error.message });
      }
      const msg = error instanceof Error ? error.message : "Erro interno";
      return res.status(500).json({ mensagem: msg });
    }
  };

  listarAgendamento = async (req: any, res: any) => {
    if (!req.user) {
      return res.status(401).json({ mensagem: "Token inválido" });
    }
    try {
      const agendamento = await this.agendamentoBarberService.listarAgendamento(
        req.user.empresaId
      );
      return res.status(200).json(agendamento);
    } catch (error: any) {
      return res.status(500).json({ mensagem: error.message });
    }
  };

  deleteAgendamento = async (req: any, res: any) => {
    if (!req.user) {
      return res.status(401).json({ mensagem: "Token inválido" });
    }
    const agendamentoId = parseInt(req.params.id, 10);
    try {
      await this.agendamentoBarberService.deleteAgendamento(
        agendamentoId,
        req.user.empresaId
      );
      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ mensagem: error.message });
    }
  };
}
