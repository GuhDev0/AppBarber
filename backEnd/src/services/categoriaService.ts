import { CategoriaRepository } from "../repository/categoriaRepository";

const categoriaDB = new CategoriaRepository


export class CategoriaService {
    listCategoriaService = async (empresaId:number) =>{
        
        try{
            if(!empresaId){
                throw new Error("Usuario não autenticado") 
            }
            const listDB = await categoriaDB.listDeCategoria(empresaId)
            if(!listDB){
                throw new Error("Lista não encontrada") 
            }
            return listDB
        }catch(error:any){
            console.error("Nao foi possivel Buscar lista",error.message)
            throw new Error(error.message)
        }
    }   
}