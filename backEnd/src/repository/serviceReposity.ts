import { PrismaClient } from "../../generated/prisma/index.js";
import type { serviceDTO } from "../Dtos/ServiceDTO.js";
const prisma =  new PrismaClient()

export class ServiceRepository{
    
    createdServiceRepository  = async (serviceDTO:serviceDTO,empresaId:number,usuarioId:number) => {
        const saveServiceDB  = await prisma.servico.create(
           {
            data:{
                tipoDoServico:serviceDTO.tipoDoServico,
                valorDoServico:serviceDTO.valorDoServico,
                barbeiro:serviceDTO.barbeiro,
                data:new Date(serviceDTO.data),
                hora:serviceDTO.hora,
                empresaId: empresaId,
                usuarioId: usuarioId
            }
           }
        )
        return saveServiceDB
        
    }
    findListService = async (empresaId:number) =>{
        const list = await prisma.servico.findMany(
            {
                where:{
                    empresaId:empresaId
                }
            }
        )
        return list
    }
   

}



