import { CategoriaRepository } from "../repository/categoriaRepository.js";
const categoriaDB = new CategoriaRepository;
export class CategoriaService {
    listCategoriaService = async (empresaId) => {
        try {
            if (!empresaId) {
                throw new Error("Usuario não autenticado");
            }
            const listDB = await categoriaDB.listDeCategoria(empresaId);
            if (!listDB) {
                throw new Error("Lista não encontrada");
            }
            return listDB;
        }
        catch (error) {
            console.error("Nao foi possivel Buscar lista", error.message);
            throw new Error(error.message);
        }
    };
}
//# sourceMappingURL=categoriaService.js.map