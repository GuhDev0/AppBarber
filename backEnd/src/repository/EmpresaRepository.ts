
import type { empresaDto } from "../Dtos/empresaDto.js";
import { prisma } from '../prisma.js';

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
}
