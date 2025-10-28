import { CategoriaService } from "../services/categoriaService.js";
import type { Request, Response } from "express";

const categoriaService = new CategoriaService();

export class CategoriaController {
    listCategoriaController = async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ mensagem: "Usuário não autenticado" });
        }

        try {
            const empresaId = req.user.empresaId;
            const list = await categoriaService.listCategoriaService(empresaId);

            return res.status(200).json({list});
        } catch (error: any) {
            console.error("Erro ao encontrar lista:", error.message);
            return res.status(500).json({ message: error.message });
        }
    };
}
