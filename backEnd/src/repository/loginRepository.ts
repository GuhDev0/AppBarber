import type { loginDto } from "../Dtos/loginDto";
import { prisma } from "../prisma";

export class LoginRepository {
    findByEmail = async (loginDto: loginDto) => {
        const usuario = await prisma.usuario.findUnique({
            where: { email: loginDto.loginEmail },
            include: { empresa: true },            
        });
        if (!usuario) {
            throw new Error("Usuario não encontrado")
        }

        return usuario

    }
}