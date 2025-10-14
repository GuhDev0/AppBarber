import { ServiceRepository } from "../repository/serviceReposity.js";
import type { serviceDTO } from "../Dtos/ServiceDTO.js";
const serviceReposity = new ServiceRepository()


export class ServiceService {
     saveServiceService  = async (serviceDTO:serviceDTO ,empresaId:number,usuarioId:number) =>{
        const save =  await serviceReposity.createdServiceRepository(serviceDTO,empresaId,usuarioId)
        console.log(save)
        return save
    }

    
}