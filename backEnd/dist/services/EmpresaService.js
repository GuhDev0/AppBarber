"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresaService = void 0;
const empresaDto_1 = require("../Dtos/empresaDto"); // importa o Zod schema
const EmpresaRepository_1 = require("../repository/EmpresaRepository");
const empresaDB = new EmpresaRepository_1.Empresa();
class EmpresaService {
    createEmpresaService = async (dados) => {
        const parsed = empresaDto_1.empresaDto.safeParse(dados);
        if (!parsed.success) {
            const erros = parsed.error.issues.map(i => i.message).join(", ");
            throw new Error(erros);
        }
        //validando cnpj unico
        const existeCNPJ = await empresaDB.findByCPNJ(parsed.data.cnpj);
        if (existeCNPJ) {
            throw new Error("CNPJ já cadastrado.");
        }
        //validando nome unico
        const existeNomeDaEmpresa = await empresaDB.findByNome(parsed.data.nomeDaEmpresa);
        if (existeNomeDaEmpresa) {
            throw new Error("Nome da empresa já cadastrado.");
        }
        const existeEmail = await empresaDB.findByEmail(parsed.data.email);
        if (existeEmail) {
            throw new Error("Email já cadastrado.");
        }
        const validData = parsed.data;
        const empresa = await empresaDB.RegistraEmpresa(validData);
        return empresa;
    };
    empresaFindByIdService = async (id) => {
        const empresa = await empresaDB.findByIdEmpresa(id);
        return empresa;
    };
    listaDeEmpresaService = async () => {
        try {
            const listaDB = await empresaDB.buscarListaDeEmpresas();
            return listaDB;
        }
        catch (error) {
            console.error(error.message);
            throw new Error("Erro ao buscar a lista de empresas no banco");
        }
    };
    existeEmpresaPorCNPJService = async (cnpj) => {
        try {
            const empresa = await empresaDB.findByCPNJ(cnpj);
            if (!empresa) {
                return null;
            }
            return empresa;
        }
        catch (error) {
            console.error(error.message);
            console.error(error.message);
            throw new Error("Erro ao verificar existência de empresa por CNPJ");
        }
    };
}
exports.EmpresaService = EmpresaService;
