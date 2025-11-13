"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Empresa = void 0;
const prisma_1 = require("../prisma");
class Empresa {
    RegistraEmpresa = async (empresaDto) => {
        const empresa = await prisma_1.prisma.empresa.create({
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
        const findId = await prisma_1.prisma.empresa.findUnique({
            where: {
                id: idParam
            }
        });
        return findId;
    };
    buscarListaDeEmpresas = async () => {
        try {
            const lista = await prisma_1.prisma.empresa.findMany({
                select: {
                    id: true,
                    cnpj: true,
                    nomeDaEmpresa: true,
                    endereco: true,
                }
            });
            return lista;
        }
        catch (error) {
            throw new Error("Nao possivel buscar lista de empresa");
            console.log(error.message);
        }
    };
}
exports.Empresa = Empresa;
