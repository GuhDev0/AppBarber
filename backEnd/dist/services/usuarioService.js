"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioService = void 0;
const usuarioRepository_1 = __importDefault(require("../repository/usuarioRepository"));
const EmpresaService_1 = require("./EmpresaService");
const usuarioDb = new usuarioRepository_1.default();
const empresaServicee = new EmpresaService_1.EmpresaService();
class UsuarioService {
    usuarioRegisterService = async (UsuarioDto, empresaId) => {
        const user = (await usuarioDb.registrarUsuario(UsuarioDto, empresaId));
        return user;
    };
}
exports.UsuarioService = UsuarioService;
