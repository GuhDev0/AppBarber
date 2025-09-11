import { UsuarioService} from "../services/usuarioService.js";
import type { Request, Response } from "express";
import type usuarioDto from "../Dtos/usuarioDto.js";
const userService = new UsuarioService()
 
export class UserController{
    
     postCreateUser = async (req:Request, res:Response) => {
       const dataRequest = req.body
        try{
        const newUser =   await userService.usuarioRegisterService(dataRequest)
         res.status(201).json("Registrado Com Sucesso")   
    }catch(error){
            res.status(500).json("Erro interno ao criar usuario")
       }
    }
}

