"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaRepository = void 0;
const prisma_1 = require("../prisma");
class CategoriaRepository {
    listDeCategoria = async (empresaId) => {
        try {
            const list = await prisma_1.prisma.categoria.findMany({
                where: {
                    empresaId: empresaId
                }, include: {
                    gestaoFinanceira: true,
                }
            });
            return list;
        }
        catch (error) {
            console.error("não foi possivel encontra Lista de categoria", error.message);
            throw new Error(error.message);
        }
    };
}
exports.CategoriaRepository = CategoriaRepository;
