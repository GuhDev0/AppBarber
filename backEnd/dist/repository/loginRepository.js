import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
export class LoginRepository {
    findByEmail = async (loginDto) => {
        const usuario = await prisma.usuario.findUnique({
            where: { email: loginDto.loginEmail },
            include: { empresa: true },
        });
        if (!usuario) {
            throw new Error("Usuario não encontrado");
        }
        return usuario;
    };
}
//# sourceMappingURL=loginRepository.js.map