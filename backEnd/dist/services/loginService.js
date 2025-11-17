"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginService = void 0;
const loginRepository_1 = require("../repository/loginRepository");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const loginRepository = new loginRepository_1.LoginRepository();
const cs = process.env.CHAVE_SECRETA;
class LoginService {
    login = async (loginDto) => {
        try {
            const usuario = await loginRepository.findByEmail(loginDto);
            if (!usuario) {
                throw new Error("Usuario não Encontrado");
            }
            const validarSenha = await bcrypt_1.default.compare(loginDto.loginSenha, usuario.senha);
            if (!validarSenha) {
                throw new Error("Senha Incorreta");
            }
            const payload = {
                id: usuario.id,
                name: usuario.nomeCompleto,
                telefone: usuario.telefone,
                email: usuario.email,
                role: usuario.tipoDaConta,
                //Empresa
                empresaId: usuario.empresaId,
                nameEmpresa: usuario.empresa.nomeDaEmpresa,
            };
            const token = jsonwebtoken_1.default.sign(payload, cs, { expiresIn: "24h" });
            const { senha, ...usuarioSemSenha } = usuario;
            return { token, usuario: usuarioSemSenha };
        }
        catch (error) {
            throw new Error(error.message || "Erro no Login");
        }
    };
}
exports.LoginService = LoginService;
