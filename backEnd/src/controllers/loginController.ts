import { LoginService } from "../services/loginService.js";
import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UsuarioService } from "../services/usuarioService.js";
const loginService = new LoginService();


export class LoginController{
    login = async (req:Request,res:Response ) =>{
        const requisiçãoLogin = req.body
        try{
            const  usuarioService = await loginService.login(requisiçãoLogin)
            res.status(200).json(usuarioService)
        }catch(error:any){
            res.status(500).json({mensangem: error.message})
        }
       
    }
    
}