"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GestaoFinanceiraDB = void 0;
const prisma_1 = require("../prisma");
class GestaoFinanceiraDB {
    // Criar lançamento
    async criarLancamento(gtGto, empresaId, categoriaId) {
        const createDB = await prisma_1.prisma.gestaoFinanceira.create({
            data: {
                descricao: gtGto.descricao,
                valor: gtGto.valor,
                formaDePagamento: gtGto.formaDePagamento,
                tipo: gtGto.tipo,
                hora: gtGto.hora,
                data: gtGto.data ?? new Date(),
                categoriaId: categoriaId ?? null,
                empresaId,
                colaboradorId: gtGto.colaboradorId ?? null,
                servicoAssociadoId: gtGto.servicoAssociadoId ?? null,
            },
            include: {
                categoria: true,
            },
        });
        return createDB;
    }
    // Listar lançamentos
    async listaDeLancamentos(empresaId) {
        const list = await prisma_1.prisma.gestaoFinanceira.findMany({
            where: { empresaId },
            include: { categoria: true },
        });
        return list.map((item) => ({
            ...item,
            nomeCategoria: item.categoria?.nomeCategoria ?? "Sem Categoria",
        }));
    }
    // Deletar lançamento
    async deleteLancamento(id) {
        const deleteLancamento = await prisma_1.prisma.gestaoFinanceira.delete({
            where: { id },
        });
        return deleteLancamento;
    }
}
exports.GestaoFinanceiraDB = GestaoFinanceiraDB;
