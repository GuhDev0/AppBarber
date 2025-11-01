import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
export class CategoriaRepository {
    listDeCategoria = async (empresaId) => {
        try {
            const list = await prisma.categoria.findMany({
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
//# sourceMappingURL=categoriaRepository.js.map