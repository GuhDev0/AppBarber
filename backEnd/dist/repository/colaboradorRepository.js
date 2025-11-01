import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
export class ColaboradorDB {
    saveColaborador = async (colaboradorDto, empresaId) => {
        console.log(" Dados recebidos no Repository:", colaboradorDto);
        const save = await prisma.colaborador.create({
            data: {
                nomeCompleto: colaboradorDto.nomeCompleto,
                email: colaboradorDto.email,
                dataDeNascimento: new Date(colaboradorDto.dataNascimento),
                tel: colaboradorDto.tel,
                senha: colaboradorDto.senha,
                empresaId: empresaId,
                avatar: colaboradorDto.avatar
            },
        });
        return save;
    };
    buscarListaDeColaboradores = async (empresaId) => {
        const data = await prisma.colaborador.findMany({
            where: { empresaId: empresaId },
            include: {
                servicos: true
            }
        });
        return data;
    };
    buscarColaboradorId = async (id) => {
        const colaborador = await prisma.colaborador.findUnique({
            where: { id },
            include: {
                servicos: true
            }
        });
        return colaborador;
    };
    deleteColaboradorId = async (empresaId, id) => {
        const colaborador = await prisma.colaborador.findFirst({
            where: {
                id,
                empresaId,
            }
        });
        if (!colaborador) {
            throw new Error("Usuario não pertece a essa empresa");
        }
        const deleteColaborador = await prisma.colaborador.delete({
            where: {
                id
            }
        });
        return deleteColaborador;
    };
}
//# sourceMappingURL=colaboradorRepository.js.map