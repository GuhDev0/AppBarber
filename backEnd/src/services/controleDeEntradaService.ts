import { ControleDeEntradaDB } from "../repository/controleDeEntradaRepository.js";
import type { ControleDeEntradaDTO } from "../Dtos/controleDeEntrada.js";
import { ValidControleDeEntrada } from "../validity/validControleDeEntrada.js";
const controleDeEntradaDB =   new ControleDeEntradaDB()
const validControleDeEntrada = new ValidControleDeEntrada()

export class ControleDeEntradaService {
    saveEntrada = async (controleDeEntradaDTO:ControleDeEntradaDTO ) => {
        try{
            validControleDeEntrada.valid(controleDeEntradaDTO)
            
            const saveDB = await controleDeEntradaDB.saveEntrada(controleDeEntradaDTO)
             if(!saveDB){
                throw new Error("Dados não salvo")
             }
                
            return saveDB 
        }catch(error:any){
            console.error("Erro em saveEntrada:", error);
            throw new Error("Erro nos dados fornecido")
        }
    }
}