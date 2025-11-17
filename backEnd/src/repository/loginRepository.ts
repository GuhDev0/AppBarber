import type { loginDto } from "../Dtos/loginDto";
import { prisma } from "../prisma";

export class LoginRepository {
    findByEmail = async (loginDto: loginDto) => {
        const usuario = await prisma.usuario.findUnique({
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



        return usuario

    }
}