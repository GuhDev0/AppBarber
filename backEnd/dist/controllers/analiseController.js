"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnaliseController = void 0;
const analiseService_1 = require("../services/analiseService");
const analiseService = new analiseService_1.AnaliseService();
class AnaliseController {
    analisePorColaborador = async (req, res) => {
        if (!req.user) {
            return res.status(400).json("Token invalido ou inspirado");
        }
        const reqId = req.params.id;
        const id = Number(reqId);
        try {
            const analise = await analiseService.analiseCompletaPorColaborador(req.user.empresaId, id);
            res.status(200).json(analise);
        }
        catch (error) {
            res.status(500).json({ message: "Erro no servidor", detalhe: error.message });
        }
    };
    analisePorEmpresa = async (req, res) => {
        if (!req.user) {
            return res.status(400).json("Token invalido ou inspirado");
        }
        try {
            const analise = await analiseService.analiseCompletoPorEmpresaService(req.user.empresaId);
            res.status(200).json(analise);
        }
        catch (error) {
            res.status(500).json({ message: "Erro no servidor", detalhe: error.message });
        }
    };
}
exports.AnaliseController = AnaliseController;
