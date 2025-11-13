"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRepository = void 0;
const prisma_1 = require("../prisma");
class LoginRepository {
    findByEmail = async (loginDto) => {
        const usuario = await prisma_1.prisma.usuario.findUnique({
            where: { email: loginDto.loginEmail },
            include: { empresa: true },
        });
        if (!usuario) {
            throw new Error("Usuario não encontrado");
        }
        return usuario;
    };
}
exports.LoginRepository = LoginRepository;
