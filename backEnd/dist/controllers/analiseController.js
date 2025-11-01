import { AnaliseService } from "../services/analiseService.js";
const analiseService = new AnaliseService();
export class AnaliseController {
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
}
//# sourceMappingURL=analiseController.js.map