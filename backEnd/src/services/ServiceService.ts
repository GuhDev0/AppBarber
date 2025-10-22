import { ServiceRepository } from "../repository/serviceReposity.js";
import type { serviceDTO } from "../Dtos/ServiceDTO.js";
const serviceReposity = new ServiceRepository()


export class ServiceService {
     saveServiceService  = async (serviceDTO:serviceDTO ,empresaId:number,usuarioId:number,colaboradorId:number) =>{
        const save =  await serviceReposity.createdServiceRepository(serviceDTO,empresaId,usuarioId,colaboradorId)
        console.log(save)
        return save
    }
    findListService = async (empresaId:number) =>{
        const data = await serviceReposity.findListService(empresaId)
        return data
    }

    deleteService = async ( serviceId:number) =>{
        const deleteService = await serviceReposity.deleteService(serviceId)
        if(!deleteService){
             throw new Error("service não encontrado")  
        }
        return deleteService
    }
    
}