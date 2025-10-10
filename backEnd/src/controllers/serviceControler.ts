import { ServiceService } from "../services/ServiceService.js";
import type { Request,Response } from "express";
const serviceService = new ServiceService


export class ServiceController{

    //registrar servico
    saveService = async (req:Request, res:Response) =>{
        const reqData = req.body
        try{
            const serviceSave = await serviceService.saveServiceService(reqData)
            res.status(201).json(serviceSave)

        }catch(error){
            res.status(500).json("Error no servidor")
        }
    } 
}