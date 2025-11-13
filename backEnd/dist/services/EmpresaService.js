"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaService = void 0;
const EmpresaRepository_1 = require("../repository/EmpresaRepository");
const empresaDB = new EmpresaRepository_1.Empresa();
class EmpresaService {
    createEmpresaService = async (empresaDto) => {
        const empresa = await empresaDB.RegistraEmpresa(empresaDto);
        return empresa;
    };
    empresaFindByIdService = async (id) => {
        const empresaId = await empresaDB.findByIdEmpresa(id);
        return empresaId;
    };
    listaDeEmpresaService = async () => {
        try {
            const listaDB = empresaDB.buscarListaDeEmpresas();
            return listaDB;
        }
        catch (error) {
            throw new Error("Erro busca a lista de empresas no banco");
            console.error(error.message);
        }
    };
}
exports.EmpresaService = EmpresaService;
