import { PrismaClient } from "../../generated/prisma/index.js";
import type UsuarioDto from '../Dtos/usuarioDto.js';
const prisma = new PrismaClient();

export default class repositoryUsuario {
     registrarUsuario  = async (usuarioDto: UsuarioDto) =>{
        const user = await prisma.usuario.create(
            {
                data: {
                    nomeCompleto: usuarioDto.nomeCompleto,
                    email: usuarioDto.email,
                    senha: usuarioDto.senha,
                    telefone: usuarioDto.telefone,
                    cpf: usuarioDto.cpf,
                    tipoDaConta: usuarioDto.tipoDaConta
                }
            }

        )
        return user
    }
}

