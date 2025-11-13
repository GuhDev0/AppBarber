"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColaboradorDB = void 0;
const prisma_1 = require("../prisma");
class ColaboradorDB {
    saveColaborador = async (colaboradorDto) => {
        return await prisma_1.prisma.colaborador.create({
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
        return await prisma_1.prisma.colaborador.findMany({
            where: { empresaId },
            include: { servicos: true },
        });
    };
    buscarColaboradorId = async (id) => {
        return await prisma_1.prisma.colaborador.findUnique({
            where: { id },
            include: { servicos: true },
        });
    };
    deleteColaboradorId = async (empresaId, id) => {
        const colaborador = await prisma_1.prisma.colaborador.findFirst({
            where: { id, empresaId },
        });
        if (!colaborador)
            throw new Error("Usuário não pertence a essa empresa");
        return await prisma_1.prisma.colaborador.delete({ where: { id } });
    };
}
exports.ColaboradorDB = ColaboradorDB;
