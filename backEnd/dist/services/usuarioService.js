"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioService = void 0;
const usuarioRepository_1 = __importDefault(require("../repository/usuarioRepository"));
const colaboradorService_1 = require("./colaboradorService");
const clienteService_1 = require("./clienteService");
const usuarioDb = new usuarioRepository_1.default();
const colaboradorService = new colaboradorService_1.ColaboradorService();
const clienteService = new clienteService_1.ClienteService();
class UsuarioService {
    usuarioRegisterService = async (UsuarioDto, empresaId) => {
        try {
            const user = await usuarioDb.registrarUsuario(UsuarioDto, empresaId);
            const adminDto = {
                nomeCompleto: "ADMIN",
                email: UsuarioDto.email,
                dataNascimento: "",
                empresaId: empresaId,
                tel: UsuarioDto.telefone,
                senha: "",
                avatar: ""
            };
            const adminColaborador = await colaboradorService.saveColaboradorService(adminDto);
            return { user };
        }
        catch (error) {
            console.error("Erro ao registrar usuário:", error.message);
            throw new Error(error.message);
        }
    };
}
exports.UsuarioService = UsuarioService;
