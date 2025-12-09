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
                dataDeNascimento: colaboradorDto.dataNascimento
                    ? new Date(colaboradorDto.dataNascimento)
                    : new Date("2000-01-01"),
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
        // Verifica se o colaborador existe
        const colaborador = await prisma_1.prisma.colaborador.findFirst({
            where: { id, empresaId },
        });
        if (!colaborador)
            throw new Error("Usuário não pertence a essa empresa");
        console.log("Colaborador deletado com sucesso", id);
        return await prisma_1.prisma.$transaction(async (tx) => {
            await tx.servico.deleteMany({
                where: { colaboradorId: id },
            });
            const deleted = await tx.colaborador.delete({
                where: { id },
            });
            return deleted;
        });
    };
}
exports.ColaboradorDB = ColaboradorDB;
