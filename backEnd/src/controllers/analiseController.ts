import { AnaliseService } from "../services/analiseService.js";
import type{ Request,Response } from "express";
const analiseService = new AnaliseService()

export class AnaliseController{
  analisePorColaborador = async  (req:Request,res:Response) => {
   if(!req.user){
    return res.status(400).json("Token invalido ou inspirado")
   }
   const reqId = req.params.id
   const id = Number(reqId)
    
   try{
     const analise = await  analiseService.analiseCompletaPorColaborador(req.user.empresaId,id)
    res.status(200).json(analise)
   }catch(error:any){
    res.status(500).json({message:"Erro no servidor", detalhe:error.message})
   }
  }

  }