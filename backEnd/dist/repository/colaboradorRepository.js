import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
export class ColaboradorDB {
    saveColaborador = async (colaboradorDto, empresaId) => {
        console.log("🧾 Dados recebidos no Repository:", colaboradorDto);
        const save = await prisma.colaborador.create({
            data: {
                nomeCompleto: colaboradorDto.nome,
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
        });
        return data;
    };
    buscarColaboradorId = async (id) => {
        const colaborador = await prisma.colaborador.findUnique({
            where: {
                id
            }
        });
        return console.log(colaborador);
    };
}
//# sourceMappingURL=colaboradorRepository.js.map