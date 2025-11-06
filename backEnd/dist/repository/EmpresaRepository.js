import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export class Empresa {
    RegistraEmpresa = async (empresaDto) => {
        const empresa = await prisma.empresa.create({
            data: {
                nomeDaEmpresa: empresaDto.nomeDaEmpresa,
                cnpj: empresaDto.cnpj,
                email: empresaDto.email,
                telefone: empresaDto.telefone,
                endereco: empresaDto.endereco
            }
        });
        return empresa;
    };
    findByIdEmpresa = async (idParam) => {
        const findId = await prisma.empresa.findUnique({
            where: {
                id: idParam
            }
        });
        return findId;
    };
}
