"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const analise_1 = require("../repository/analise");
const analiseService_1 = require("../services/analiseService");
const analise = new analiseService_1.AnaliseService();
const analiseDB = new analise_1.Analise();
class Teste {
    retornaLista = async (empresaId, colaboradorId) => {
        try {
            const lista = await analise.analiseCompletaPorColaborador(empresaId, colaboradorId);
            return lista;
        }
        catch (error) {
            console.error(error.message);
        }
    };
}
const test = new Teste();
test.retornaLista(1, 1);
