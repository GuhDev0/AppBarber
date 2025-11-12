import { GestaoFinanceiraDB } from "../repository/gestaoFinanceiraRepository.js";
import { prisma } from "../prisma.js";
const gestaoFinanceiraDB = new GestaoFinanceiraDB();
export class GestaoFinanceiraService {
    saveLancamentoService = async (gtDto, empresaId) => {
        try {
            let categoria = await prisma.categoria.findFirst({
                where: { nomeCategoria: gtDto.nomeCategoria }
            });
            if (!categoria) {
                categoria = await prisma.categoria.create({
                    data: { nomeCategoria: gtDto.nomeCategoria, empresaId: empresaId }
                });
            }
            const saveLancamentoDB = await gestaoFinanceiraDB.criarLancamento(gtDto, empresaId, categoria.id);
            if (!saveLancamentoDB) {
                throw new Error("Dados não foram salvos");
            }
            return saveLancamentoDB;
        }
        catch (error) {
            console.error("Erro em saveLancamentoService:", error);
            throw new Error("Erro ao salvar lançamento financeiro");
        }
    };
    buscarListaDelancamentosService = async (empresaId) => {
        try {
            const list = await gestaoFinanceiraDB.listaDeLancamentos(empresaId);
            return list;
        }
        catch (error) {
            console.error("Erro ao buscar Lista no banco ", error.message);
            throw new Error(error.message);
        }
    };
    deleteLancamentoService = async (id, empresaId) => {
        try {
            const deleteDoDb = await gestaoFinanceiraDB.deleteLancamento(id);
            if (!deleteDoDb) {
                throw new Error("Não foi possivel deletar Lançamento");
            }
            return deleteDoDb;
        }
        catch (error) {
            console.error("Erro ao encontra Lançamento", error.message);
            throw new Error(error.message);
        }
    };
}
