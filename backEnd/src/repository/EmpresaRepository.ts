
import type { empresaDto } from "../Dtos/empresaDto";
import { prisma } from '../prisma';

export class Empresa {
    RegistraEmpresa = async (empresaDto: empresaDto) => {
        const empresa = await prisma.empresa.create({
            data: {
                nomeDaEmpresa: empresaDto.nomeDaEmpresa,
                cnpj: empresaDto.cnpj,
                email: empresaDto.email,
                telefone: empresaDto.telefone,
                endereco: empresaDto.endereco
            }

        })
        return empresa
    }

    findByIdEmpresa = async (idParam: number) => {
        const findId = await prisma.empresa.findUnique(
            {
                where: {
                    id: idParam
                }
            }
        )
        return findId
    }

    buscarListaDeEmpresas = async () => {
        try {
            const lista = await prisma.empresa.findMany({
                select: {
                    id: true,
                    cnpj: true,
                    nomeDaEmpresa: true,
                    endereco: true,

                }
            })
            return lista
        } catch (error: any) {
            throw new Error("Nao possivel buscar lista de empresa")
            console.log(error.message)
        }
    }
    findByCPNJ = async (cnpj: string) => {
        const empresaCNPJ = await prisma.empresa.findUnique({
            where: { cnpj }
        })
        return empresaCNPJ
    }

    findByNome = async (nomeDaEmpresa: string) => {
        const empresaNome = await prisma.empresa.findUnique({
            where: { nomeDaEmpresa }
        })
        return empresaNome
    }

   findByEmail = async (email: string) => {
    const empresaEmail = await prisma.empresa.findUnique({
        where: { email }
    })
    return empresaEmail
}

    findByCNPJ = async (cnpj: string) => {
        try {
            const empresaCNPJ = await prisma.empresa.findUnique({
                where: { cnpj }
                ,select: {
                    id:true,
                    nomeDaEmpresa:true,
                    cnpj:true,
                }
            })
            return empresaCNPJ   
        } catch (error: any) {
            throw new Error("Não foi possivel buscar empresa por CNPJ")
        }

    }
}
