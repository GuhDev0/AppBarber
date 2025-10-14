import { ControleDeEntradaService } from "../services/controleDeEntradaService.js";
import  type{ Request,Response } from "express";
const controleDeEntradaService = new ControleDeEntradaService()


export class ControleDeEntradaController {
    saveEntrada = async (req:Request,res:Response) =>{
        try{    
            const reqEntrada = req.body
            if(!reqEntrada){
                res.status(400).json("Dados incorretos")
            }
            const saveReqDb = await controleDeEntradaService.saveEntrada(reqEntrada)
            return res.status(201).json("Registrado Com Sucesso " ) 
        }catch(error:any){
            console.error(error.message)
           return res.status(500).json({message:error.message})
        }
    }
}