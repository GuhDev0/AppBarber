import { PrismaClient } from "../../generated/prisma/index.js";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
export default class repositoryUsuario {
    registrarUsuario = async (usuarioDto, empresaId) => {
        try {
            const SALT = 10;
            const senhaCriptografada = await bcrypt.hash(usuarioDto.senha, SALT);
            const user = await prisma.usuario.create({
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
//# sourceMappingURL=usuarioRepository.js.map