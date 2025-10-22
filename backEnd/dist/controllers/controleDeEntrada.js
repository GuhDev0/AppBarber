import { ControleDeEntradaService } from "../services/controleDeEntradaService.js";
const controleDeEntradaService = new ControleDeEntradaService();
export class ControleDeEntradaController {
    saveEntrada = async (req, res) => {
        try {
            const reqEntrada = req.body;
            if (!reqEntrada) {
                res.status(400).json("Dados incorretos");
            }
            const saveReqDb = await controleDeEntradaService.saveEntrada(reqEntrada);
            return res.status(201).json("Registrado Com Sucesso ");
        }
        catch (error) {
            console.error(error.message);
            return res.status(500).json({ message: error.message });
        }
    };
}
//# sourceMappingURL=controleDeEntrada.js.map