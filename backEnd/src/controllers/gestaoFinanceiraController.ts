import { GestaoFinanceiraService } from "../services/gestaoFinanceiraService.js";
import  type{ Request,Response } from "express";
const gestaoFinanceiraService = new GestaoFinanceiraService()


export class GestaoFinanceiraController {
    saveLancamento = async (req:Request,res:Response) =>{
        if(!req.user){
           return res.status(401).json({mensagem:"Token invalido"})
        }
        const reqEntrada = req.body
        try{    
            
            if(!reqEntrada){
                res.status(400).json("Dados incorretos")
            }
            const lancamento = await gestaoFinanceiraService.saveLancamentoService(reqEntrada,req.user.empresaId)
            return res.status(201).json("Registrado Com Sucesso " ) 
        }catch(error:any){
            console.error(error.message)
           return res.status(500).json({message:error.message})
        }
    }
    listLancamento = async (req:Request,res:Response) =>{
        if(!req.user){
           return res.status(401).json({mensagem:"Token invalido"})
        }
        try{
           const list = await gestaoFinanceiraService.buscarListaDelancamentosService(req.user.empresaId)
           res.status(200).json({mensagem:" Lista De Lançamentos: ",
             lista:list
           })
        }catch(error:any){
            res.status(500).json(error.message)
        }
    }
}