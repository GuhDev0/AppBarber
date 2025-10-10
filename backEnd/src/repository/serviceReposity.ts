import { PrismaClient } from "../../generated/prisma/index.js";
import type { serviceDTO } from "../Dtos/ServiceDTO.js";
const prisma =  new PrismaClient()

export class ServiceRepository{
    
    createdServiceRepository  = async (serviceDTO:serviceDTO) => {
        const saveServiceDB  = await prisma.servico.create(
           {
            data:{
                tipoDoServico:serviceDTO.tipoDoServico,
                valorDoServico:serviceDTO.valorDoServico,
                barbeiro:serviceDTO.barbeiro,
                data:new Date(serviceDTO.data),
                hora:serviceDTO.hora
            }
           }
        )
        return saveServiceDB
        
    }
    findListService = async () =>{
        const list = await prisma.servico.findMany({
            include:{
                usuarioId:true,
                empresaId:true,
            },
        });    
    }
   
}

