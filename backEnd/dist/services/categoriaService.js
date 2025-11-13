"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriaService = void 0;
const categoriaRepository_1 = require("../repository/categoriaRepository");
const categoriaDB = new categoriaRepository_1.CategoriaRepository;
class CategoriaService {
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
exports.CategoriaService = CategoriaService;
