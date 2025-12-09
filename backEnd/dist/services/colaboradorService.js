"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColaboradorService = void 0;
const colaboradorRepository_1 = require("../repository/colaboradorRepository");
const EmpresaRepository_1 = require("../repository/EmpresaRepository");
const empresaDB = new EmpresaRepository_1.Empresa();
const bcrypt_1 = __importDefault(require("bcrypt"));
const colaboradorDB = new colaboradorRepository_1.ColaboradorDB();
class ColaboradorService {
    gerarSenhaAleatoria = (tamanho = 8) => {
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        let senha = "";
        for (let i = 0; i < tamanho; i++) {
            const indice = Math.floor(Math.random() * caracteres.length);
            senha += caracteres[indice];
        }
        return senha;
    };
    saveColaboradorService = async (colaboradorDto) => {
        try {
            if (!colaboradorDto.nomeCompleto || typeof colaboradorDto.nomeCompleto !== 'string') {
                throw new Error('nomeCompleto é obrigatório');
            }
            if (!colaboradorDto.email || typeof colaboradorDto.email !== 'string') {
                throw new Error('email é obrigatório');
            }
            const empresaExiste = await empresaDB.findByIdEmpresa(colaboradorDto.empresaId);
            if (!empresaExiste)
                throw new Error("Empresa não encontrada.");
            const senhaAleatoria = this.gerarSenhaAleatoria(10);
            const senhaCriptografada = await bcrypt_1.default.hash(senhaAleatoria, 10);
            const save = await colaboradorDB.saveColaborador({
                ...colaboradorDto,
                senha: senhaCriptografada,
            });
            if (!save)
                throw new Error("Erro ao salvar colaborador.");
            return { ...save, senhaGerada: senhaAleatoria };
        }
        catch (error) {
            console.error("Erro ao salvar colaborador:", error.message);
            throw new Error(error.message);
        }
    };
    buscarListaDeColaboradoresService = async (empresaId) => {
        try {
            const list = await colaboradorDB.buscarListaDeColaboradores(empresaId);
            if (!list)
                throw new Error("Erro ao buscar Lista");
            return list;
        }
        catch (error) {
            console.error("error:", error.message);
            throw new Error(error.message);
        }
    };
    buscarColaboradorId = async (id) => {
        try {
            const colaborador = await colaboradorDB.buscarColaboradorId(id);
            if (!colaborador) {
                throw new Error("Colaborador não encontrado");
            }
            return colaborador;
        }
        catch (error) {
            console.error("Error ao buscar colaborador", error.message);
            throw new Error(error.message);
        }
    };
    deleteColaboradorService = async (empresaId, colaboradorId) => {
        try {
            const deleteDB = await colaboradorDB.deleteColaboradorId(empresaId, colaboradorId);
            if (!deleteDB) {
                throw new Error("Nao foi possivel deletar colaborador ");
            }
            return deleteDB;
        }
        catch (error) {
            console.error("Erro ao deleta ", error.message);
            throw new Error(error.message);
        }
    };
}
exports.ColaboradorService = ColaboradorService;
