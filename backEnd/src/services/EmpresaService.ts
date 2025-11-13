import type { empresaDto } from "../Dtos/empresaDto";
import { Empresa } from "../repository/EmpresaRepository";

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

    listaDeEmpresaService = async () =>{
        try{
            const listaDB = empresaDB.buscarListaDeEmpresas()
            return listaDB
        }catch(error:any){
            throw new Error("Erro busca a lista de empresas no banco")    
            console.error(error.message)
        }
        }

    
}