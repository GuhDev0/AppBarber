import { ControleDeEntradaDB } from "../repository/controleDeEntradaRepository.js";
import { ValidControleDeEntrada } from "../validity/validControleDeEntrada.js";
const controleDeEntradaDB = new ControleDeEntradaDB();
const validControleDeEntrada = new ValidControleDeEntrada();
export class ControleDeEntradaService {
    saveEntrada = async (controleDeEntradaDTO) => {
        try {
            validControleDeEntrada.valid(controleDeEntradaDTO);
            const saveDB = await controleDeEntradaDB.saveEntrada(controleDeEntradaDTO);
            if (!saveDB) {
                throw new Error("Dados não salvo");
            }
            return saveDB;
        }
        catch (error) {
            console.error("Erro em saveEntrada:", error);
            throw new Error("Erro nos dados fornecido");
        }
    };
}
//# sourceMappingURL=controleDeEntradaService.js.map