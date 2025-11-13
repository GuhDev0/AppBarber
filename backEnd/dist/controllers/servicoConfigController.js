"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicoConfigController = void 0;
const servicoConfingService_1 = require("../services/servicoConfingService");
const servicoConfigService = new servicoConfingService_1.ServicoConfigService();
class ServicoConfigController {
    async registraCatalagoServicoControler(req, res) {
        if (!req.user) {
            return res.status(401).json({ mensagem: "Token inválido" });
        }
        try {
            const salvaReqData = await servicoConfigService.registraServiceCatalago(req.body, req.user.empresaId);
            return res.status(201).json({
                mensagem: "Serviço registrado com sucesso",
                dados: salvaReqData,
            });
        }
        catch (error) {
            return res.status(500).json({
                mensagem: "Erro ao registrar serviço",
                detalhe: error.message,
            });
        }
    }
    async buscarListaDeControler(req, res) {
        if (!req.user) {
            return res.status(401).json({ mensagem: "Token inválido" });
        }
        try {
            const lista = await servicoConfigService.buscarListaDeServices(req.user.empresaId);
            return res.status(200).json({ lista });
        }
        catch (error) {
            return res.status(500).json({
                mensagem: "Erro ao buscar lista de serviços",
                detalhe: error.message,
            });
        }
    }
    async deleteServicoControler(req, res) {
        if (!req.user) {
            return res.status(401).json({ mensagem: "Token inválido" });
        }
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ mensagem: "ID inválido" });
        }
        try {
            await servicoConfigService.deleteServiceId(req.user.empresaId, id);
            return res.status(200).json({ mensagem: "Serviço deletado com sucesso" });
        }
        catch (error) {
            return res.status(500).json({
                mensagem: "Erro ao deletar serviço",
                detalhe: error.message,
            });
        }
    }
}
exports.ServicoConfigController = ServicoConfigController;
