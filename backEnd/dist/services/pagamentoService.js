import { PagamentoRepository } from "../repository/pagamentoRepository.js";
const pagamentoDB = new PagamentoRepository();
export class PagamentoService {
    analisePagamento = async (empresaId) => {
        try {
            const analiseDb = await pagamentoDB.gerenciarPagamento(empresaId);
            return analiseDb;
        }
        catch (error) {
            console.error(error.message);
            throw new Error("Erro ao buscar analise", error.message);
        }
    };
}
//# sourceMappingURL=pagamentoService.js.map