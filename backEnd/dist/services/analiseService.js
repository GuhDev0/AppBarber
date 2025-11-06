import { Analise } from "../repository/analise.js";
const analiseDB = new Analise();
export class AnaliseService {
    analiseCompletaPorColaborador = async (empresaId, colaboradorId) => {
        try {
            const analisePorColaborador = await analiseDB.analiseCompletaPorColaborador(empresaId, colaboradorId);
            if (!analisePorColaborador) {
                throw new Error("Não foi possivel");
            }
            return analisePorColaborador;
        }
        catch (error) {
            console.error(error.message);
            throw new Error("Erro ao buscar Analise do colaborador");
        }
    };
}
