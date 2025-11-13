"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../prisma");
class repositoryUsuario {
    registrarUsuario = async (usuarioDto, empresaId) => {
        try {
            const SALT = 10;
            const senhaCriptografada = await bcrypt_1.default.hash(usuarioDto.senha, SALT);
            const user = await prisma_1.prisma.usuario.create({
                data: {
                    nomeCompleto: usuarioDto.nomeCompleto,
                    email: usuarioDto.email,
                    senha: senhaCriptografada,
                    telefone: usuarioDto.telefone,
                    cpf: usuarioDto.cpf,
                    tipoDaConta: usuarioDto.tipoDaConta,
                    empresa: {
                        connect: { id: empresaId },
                    },
                },
                include: {
                    empresa: true,
                },
            });
            return user;
        }
        catch (error) {
            throw new Error(`Erro ao registrar usuário: ${error}`);
        }
    };
}
exports.default = repositoryUsuario;
