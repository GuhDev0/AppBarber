import { UsuarioService} from "../services/usuarioService.js";
import type { Request, Response } from "express";
import type usuarioDto from "../Dtos/usuarioDto.js";
import { EmpresaService } from "../services/EmpresaService.js";

const userService = new UsuarioService()
const empresaService = new EmpresaService() 
export class UserController{
    
     postCreateUser = async (req:Request, res:Response) => {
       const dataRequest = req.body
          
        try{
        const newUser =   await userService.usuarioRegisterService(dataRequest,Number(dataRequest.empresaId))
         res.status(201).json("Registrado Com Sucesso")   
    }catch(error:any){
            res.status(500).json({mensagem:error.message})
       }
    }

    
}

