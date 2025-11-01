import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
export class GestaoFinanceiraDB {
    criarLancamento = async (gtGto, empresaId, categoriaId) => {
        const createDB = await prisma.gestaoFinanceira.create({
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
            }
        });
        return createDB;
    };
    listaDeLancamentos = async (empresaId) => {
        const list = await prisma.gestaoFinanceira.findMany({
            where: { empresaId },
            include: { categoria: true },
        });
        return list.map(item => ({
            ...item,
            nomeCategoria: item.categoria?.nomeCategoria ?? "Sem Categoria"
        }));
    };
    deleteLancamento = async (id) => {
        const deleteLancamento = await prisma.gestaoFinanceira.delete({
            where: {
                id: id
            }
        });
        return deleteLancamento;
    };
}
//# sourceMappingURL=gestaoFinanceiraRepository.js.map