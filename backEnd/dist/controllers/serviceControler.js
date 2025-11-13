"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceController = void 0;
const ServiceService_1 = require("../services/ServiceService");
const colaboradorService_1 = require("../services/colaboradorService");
const serviceService = new ServiceService_1.ServiceService();
const colaboradorService = new colaboradorService_1.ColaboradorService();
class ServiceController {
    saveService = async (req, res) => {
        const { colaboradorId } = req.body;
        const reqData = req.body;
        if (!req.user) {
            return res.status(401).json({ mensagem: "Usuário não autenticado" });
        }
        try {
            const serviceSave = await serviceService.saveServiceService(reqData, req.user.empresaId, req.user.id, colaboradorId);
            res.status(201).json(serviceSave);
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ mensagem: "Error no servidor", detalhe: error.message });
        }
    };
    findByIdListService = async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ mensagem: "Usuário não autenticado" });
        }
        try {
            const services = await serviceService.findListService(req.user.empresaId);
            res.status(200).json({ services });
        }
        catch (error) {
            console.error(error.message);
            res.status(500).json({ mensagem: "Error no servidor", detalhe: error.message });
        }
    };
    deleteServiceController = async (req, res) => {
        const { id } = req.params;
        if (id == "") {
            return res.status(400).json({ messagem: "Id Não Fornecido" });
        }
        try {
            const deleteService = await serviceService.deleteService(Number(id));
            res.status(200).json({ message: "Serviço deletado com sucesso" });
        }
        catch (error) {
            console.error("Error : " + error.message);
            res.status(500).json({ message: "Erro no servidor", detalhe: error.message });
        }
    };
}
exports.ServiceController = ServiceController;
