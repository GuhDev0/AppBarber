import { PagamentoService } from "../services/pagamentoService.js";
const pagamentoService = new PagamentoService();
export class PagamentoController {
    analiseController = async (req, res) => {
        if (!req.user) {
            return res.status(400).json({ mensagem: "Token invalido ou expirado" });
        }
        try {
            const analise = await pagamentoService.analisePagamento(req.user.empresaId);
            res.status(200).json({ analise: analise });
        }
        catch (error) {
            res.status(500).json({ mensagem: "Erro no servidor", Error: error.mensage });
        }
    };
}
//# sourceMappingURL=pagamentoController.js.map