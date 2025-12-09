"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaController = void 0;
const EmpresaService_1 = require("../services/EmpresaService");
const empresaService = new EmpresaService_1.EmpresaService();
class EmpresaController {
    empresaCreate = async (req, res) => {
        const empresaReq = req.body;
        try {
            const empresaCreate = await empresaService.createEmpresaService(empresaReq);
            return res.status(201).json(empresaCreate);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    };
    buscarPeloId = async (req, res) => {
        const { id } = req.params;
        const empresaId = Number(id);
        if (isNaN(empresaId)) {
            return res.status(400).json({ mensagem: "ID inválido" });
        }
        try {
            const empresa = await empresaService.empresaFindByIdService(empresaId);
            if (!empresa) {
                return res.status(404).json({ mensagem: "Empresa não encontrada" });
            }
            return res.status(200).json(empresa);
        }
        catch (error) {
            return res.status(500).json({ mensagem: error.message });
        }
    };
    listaDeEmpresasController = async (req, res) => {
        try {
            const listaEmprestaService = await empresaService.listaDeEmpresaService();
            res.status(200).json({ mensagem: listaEmprestaService });
        }
        catch (error) {
            res.status(500).json({ error: error.mensagem });
        }
    };
    verificaEmpresaPorCnpj = async (req, res) => {
        const cnpj = req.query.cnpj;
        if (!cnpj) {
            return res.status(400).json({ mensagem: "CNPJ é obrigatório" });
        }
        try {
            const empresa = await empresaService.existeEmpresaPorCNPJService(cnpj);
            if (!empresa) {
                return res.status(404).json({ mensagem: "Empresa não encontrada" });
            }
            return res.status(200).json({ empresa });
        }
        catch (error) {
            console.error("Erro ao verificar empresa por CNPJ:", error.message);
            res.status(500).json({ mensagem: error.message });
        }
    };
}
exports.EmpresaController = EmpresaController;
