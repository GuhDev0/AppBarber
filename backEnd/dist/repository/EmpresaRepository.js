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
    findByCPNJ = async (cnpj) => {
        const empresaCNPJ = await prisma_1.prisma.empresa.findUnique({
            where: { cnpj }
        });
        return empresaCNPJ;
    };
    findByNome = async (nomeDaEmpresa) => {
        const empresaNome = await prisma_1.prisma.empresa.findUnique({
            where: { nomeDaEmpresa }
        });
        return empresaNome;
    };
    findByEmail = async (email) => {
        const empresaEmail = await prisma_1.prisma.empresa.findUnique({
            where: { email }
        });
        return empresaEmail;
    };
    findByCNPJ = async (cnpj) => {
        try {
            const empresaCNPJ = await prisma_1.prisma.empresa.findUnique({
                where: { cnpj },
                select: {
                    id: true,
                    nomeDaEmpresa: true,
                    cnpj: true,
                }
            });
            return empresaCNPJ;
        }
        catch (error) {
            throw new Error("Não foi possivel buscar empresa por CNPJ");
        }
    };
}
exports.Empresa = Empresa;
