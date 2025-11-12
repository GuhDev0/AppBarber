import { prisma } from "../prisma.js";
export class ColaboradorDB {
    saveColaborador = async (colaboradorDto) => {
        return await prisma.colaborador.create({
            data: {
                nomeCompleto: colaboradorDto.nomeCompleto,
                email: colaboradorDto.email,
                dataDeNascimento: new Date(colaboradorDto.dataNascimento),
                tel: colaboradorDto.tel,
                senha: colaboradorDto.senha,
                empresaId: colaboradorDto.empresaId,
                avatar: colaboradorDto.avatar,
            },
        });
    };
    buscarListaDeColaboradores = async (empresaId) => {
        return await prisma.colaborador.findMany({
            where: { empresaId },
            include: { servicos: true },
        });
    };
    buscarColaboradorId = async (id) => {
        return await prisma.colaborador.findUnique({
            where: { id },
            include: { servicos: true },
        });
    };
    deleteColaboradorId = async (empresaId, id) => {
        const colaborador = await prisma.colaborador.findFirst({
            where: { id, empresaId },
        });
        if (!colaborador)
            throw new Error("Usuário não pertence a essa empresa");
        return await prisma.colaborador.delete({ where: { id } });
    };
}
