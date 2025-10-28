import { ServicoConfingRepository } from "../repository/servicoConfigRepository.js";
import type{ catalagoServiceDto } from "../Dtos/catalagoDeService.js";
import { Empresa } from "../repository/EmpresaRepository.js";
const servicoConfigRepository = new ServicoConfingRepository

export class ServicoConfigService {
    registraServiceCatalago = async (catalaoServiceDto:catalagoServiceDto,empresaId:number) =>{
        try{
            const registraNoDB = await servicoConfigRepository.registraServiceCatalago(catalaoServiceDto,empresaId)
            if(catalaoServiceDto.nome === " "){
                throw new Error("Por favor informe o nome do serviço ")
            }
            return registraNoDB 
        }catch(error:any){
            console.error(error.message)
            throw new Error(error.message)
        }
        

    }
    buscarListaDeServices = async(empresaId:number)=>{
        try{
            const listDB = await servicoConfigRepository.buscarListaDeServico(empresaId)
            return listDB
        }catch(error:any){
            console.error({mensagem:"Erro ao encontra lista de serviços", Detalhe:error.message})
            throw new Error(error.message) 
        }
    }
    deleteServiceId = async(empresaId:number,idService:number)=>{
        try{
            const deletarDB = await servicoConfigRepository.deleteServico(empresaId,idService)
            if(isNaN(Number(idService))){
                throw new Error("Por favor informe um id ")
            }
            return deletarDB
            
        }catch(error:any){
            throw new Error(error.message)
        }
    }
}