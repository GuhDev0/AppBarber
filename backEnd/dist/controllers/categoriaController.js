import { CategoriaService } from "../services/categoriaService.js";
const categoriaService = new CategoriaService();
export class CategoriaController {
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
//# sourceMappingURL=categoriaController.js.map