"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginRepository = void 0;
const prisma_1 = require("../prisma");
class LoginRepository {
    findByEmail = async (loginDto) => {
        const usuario = await prisma_1.prisma.usuario.findUnique({
            where: { email: loginDto.loginEmail },
            select: {
                id: true,
                nomeCompleto: true,
                senha: true,
                telefone: true,
                tipoDaConta: true,
                empresaId: true,
                email: true,
                empresa: { select: { nomeDaEmpresa: true } }
            }
        });
        return usuario;
    };
}
exports.LoginRepository = LoginRepository;
