import { Analise } from "../repository/analise";
import { AnaliseService } from "../services/analiseService";
const analise = new AnaliseService()
const analiseDB = new Analise()
class Teste {
    retornaLista = async (empresaId:number,colaboradorId:number) =>{
        try{
              await  analise.analiseCompletaPorColaborador(empresaId,colaboradorId)
            }catch(error:any){
            console.error(error.message)
        }

    }
}

const test = new Teste()


test.retornaLista(1,1)