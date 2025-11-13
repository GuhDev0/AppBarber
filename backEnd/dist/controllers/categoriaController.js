"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaController = void 0;
const categoriaService_1 = require("../services/categoriaService");
const categoriaService = new categoriaService_1.CategoriaService();
class CategoriaController {
    listCategoriaController = async (req, res) => {
        if (!req.user) {
            return res.status(401).json({ mensagem: "Usuário não autenticado" });
        }
        try {
            const empresaId = req.user.empresaId;
            const list = await categoriaService.listCategoriaService(empresaId);
            return res.status(200).json({ list });
        }
        catch (error) {
            console.error("Erro ao encontrar lista:", error.message);
            return res.status(500).json({ message: error.message });
        }
    };
}
exports.CategoriaController = CategoriaController;
