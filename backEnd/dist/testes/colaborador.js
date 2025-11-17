"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colaboradorRepository_js_1 = require("../repository/colaboradorRepository.js");
const colaborador = new colaboradorRepository_js_1.ColaboradorDB();
class ColaboradorTest {
    async executeDeleteColaborador() {
        const deleteColaborador = await colaborador.deleteColaboradorId(1, 1);
    }
    async executeBuscarColaborador() {
        const buscarColaborador = await colaborador.buscarColaboradorId(1);
        console.log(buscarColaborador);
    }
}
const main = new ColaboradorTest();
main.executeDeleteColaborador();
