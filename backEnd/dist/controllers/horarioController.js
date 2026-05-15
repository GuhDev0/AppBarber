"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorarioController = void 0;
const horarioService_1 = require("../services/horarioService");
const HttpError_1 = require("../errors/HttpError");
class HorarioController {
    horarioService = new horarioService_1.HorarioService();
    criarHorario = async (req, res) => {
        const empresaId = req.user.empresaId;
        const horarioData = req.body;
        try {
            const horario = await this.horarioService.criarHorario(empresaId, horarioData);
            res.status(201).json(horario);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    listarHorariosPorColaborador = async (req, res) => {
        if (!req.user) {
            return res.status(401).json("Token Invalido");
        }
        const { id } = req.params;
        if (id == "") {
            return res.status(400).json({ messagem: "Id Não Fornecido" });
        }
        try {
            const horarios = await this.horarioService.listarHorariosPorColaborador(parseInt(id), req.user.empresaId);
            res.status(200).json(horarios);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    listarHorariosDisponiveisPorColaborador = async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ mensagem: "Token inválido" });
        }
        const colaboradorId = parseInt(req.params.id, 10);
        const dataParam = req.query.data;
        const slotParsed = req.query.slotMinutos != null
            ? parseInt(String(req.query.slotMinutos), 10)
            : NaN;
        const slotMin = !Number.isNaN(slotParsed) ? slotParsed : undefined;
        if (!colaboradorId || Number.isNaN(colaboradorId)) {
            return res.status(400).json({ mensagem: "ID do colaborador inválido" });
        }
        if (!dataParam) {
            return res.status(400).json({ mensagem: "Informe a data (query ?data=YYYY-MM-DD ou ISO)." });
        }
        try {
            const slots = await this.horarioService.listarHorariosDisponiveisPorColaborador(req.user.empresaId, colaboradorId, dataParam, slotMin ?? 40);
            return res.status(200).json(slots);
        }
        catch (error) {
            if (error instanceof HttpError_1.HttpError) {
                return res.status(error.statusCode).json({ mensagem: error.message });
            }
            const msg = error instanceof Error ? error.message : "Erro interno";
            return res.status(500).json({ mensagem: msg });
        }
    };
    deleteHorario = async (req, res) => {
        const empresaId = req.user?.empresaId;
        const horarioId = parseInt(req.params.id);
        if (!empresaId) {
            return res.status(401).json({ mensagem: "Token inválido" });
        }
        try {
            await this.horarioService.deleteHorario(horarioId, empresaId);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
    updateHorario = async (req, res) => {
        const empresaId = req.user?.empresaId;
        const horarioId = parseInt(req.params.id);
        const horarioData = req.body;
        if (!empresaId) {
            return res.status(401).json({ mensagem: "Token inválido" });
        }
        try {
            const horario = await this.horarioService.updateHorario(horarioId, horarioData, empresaId);
            res.status(200).json(horario);
        }
        catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}
exports.HorarioController = HorarioController;
