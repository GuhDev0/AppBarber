import type { empresaDto } from "../Dtos/empresaDto.js";
import { Empresa } from "../repository/EmpresaRepository.js";

const empresaDB = new Empresa();

export class EmpresaService  {
    createEmpresaService = async (empresaDto:empresaDto)  =>{
        const empresa = await empresaDB.RegistraEmpresa(empresaDto)
        return empresa;
    }

    empresaFindByIdService = async(id:number) => {
        const empresaId =   await empresaDB.findByIdEmpresa(id)
        return empresaId
    }

    
}