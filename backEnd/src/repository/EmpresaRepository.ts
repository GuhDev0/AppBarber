import { PrismaClient } from "../../generated/prisma/index.js";
import type { empresaDto } from "../Dtos/empresaDto.js";
const prisma = new PrismaClient();

export class Empresa{
 RegistraEmpresa = async (empresaDto:empresaDto) =>  {
    const empresa = await prisma.empresa.create({
        data:{
           nomeDaEmpresa: empresaDto.nomeDaEmpresa,
           cnpj: empresaDto.cnpj,
           email:empresaDto.email,
           telefone:empresaDto.telefone,
           endereco: empresaDto.endereco
        }
    
    })
    return empresa
 }

findByIdEmpresa = async (idParam:number) =>{
    const findId = await prisma.empresa.findUnique(
        {
            where:{
                id: idParam
            }
        }
    )
    return findId
}
}
