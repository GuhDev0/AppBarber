"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgendamentoBarberController = void 0;
const agendamentoService_1 = require("../services/agendamentoService");
const HttpError_1 = require("../errors/HttpError");
class AgendamentoBarberController {
    agendamentoBarberService = new agendamentoService_1.AgendamentoBarberService();
    criarAgendamento = async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ mensagem: "Token inválido" });
        }
        try {
            const agendamento = await this.agendamentoBarberService.criarAgendamento(req.user.empresaId, req.body);
            return res.status(201).json(agendamento);
        }
        catch (error) {
            if (error instanceof HttpError_1.HttpError) {
                return res.status(error.statusCode).json({ mensagem: error.message });
            }
            const msg = error instanceof Error ? error.message : "Erro interno";
            return res.status(500).json({ mensagem: msg });
        }
    };
    listarAgendamento = async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ mensagem: "Token inválido" });
        }
        try {
            const agendamento = await this.agendamentoBarberService.listarAgendamento(req.user.empresaId);
            return res.status(200).json(agendamento);
        }
        catch (error) {
            return res.status(500).json({ mensagem: error.message });
        }
    };
    deleteAgendamento = async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ mensagem: "Token inválido" });
        }
        const agendamentoId = parseInt(req.params.id, 10);
        try {
            await this.agendamentoBarberService.deleteAgendamento(agendamentoId, req.user.empresaId);
            return res.status(204).send();
        }
        catch (error) {
            return res.status(500).json({ mensagem: error.message });
        }
    };
}
exports.AgendamentoBarberController = AgendamentoBarberController;
