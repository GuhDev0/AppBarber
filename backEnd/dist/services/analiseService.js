"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnaliseService = void 0;
const analise_1 = require("../repository/analise");
const analiseDB = new analise_1.Analise();
class AnaliseService {
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
    analiseCompletoPorEmpresaService = async (empresaId) => {
        try {
            const analisePorEmpresa = await analiseDB.analiseCompletaDoEstabelecimento(empresaId);
            if (!analisePorEmpresa) {
                throw new Error("Não foi possivel");
            }
            return analisePorEmpresa;
        }
        catch (error) {
            console.error(error.message);
            throw new Error("Erro ao buscar Analise da empresa");
        }
    };
}
exports.AnaliseService = AnaliseService;
