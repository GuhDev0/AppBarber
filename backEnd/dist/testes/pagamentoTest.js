"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pagamentoService_1 = require("../services/pagamentoService");
class PagamentoTest {
    async executePagamento(empresaId) {
        const pagamentoService = new pagamentoService_1.PagamentoService();
        const executar = await pagamentoService.createPagamento(empresaId);
        return executar;
    }
}
const main = new PagamentoTest();
(async () => {
    await main.executePagamento(28);
})();
