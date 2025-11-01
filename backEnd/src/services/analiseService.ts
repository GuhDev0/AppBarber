import { Analise } from "../repository/analise.js";

const analiseDB = new Analise()

export class AnaliseService{
     analiseCompletaPorColaborador = async(empresaId:number,colaboradorId:number) =>{
      
      try{
        const analisePorColaborador = await analiseDB.analiseCompletaPorColaborador(empresaId,colaboradorId)
        return analisePorColaborador
      }catch(error:any){
        console.error(error.message)
        throw new Error("Erro ao buscar Analise do colaborador")  
      }
     }
}