import { ServiceService } from "../services/ServiceService.js";
import type { Request, Response } from "express";

const serviceService = new ServiceService

export class ServiceController {


    saveService = async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ mensagem: "Usuário não autenticado" });
        }
        console.log(req.user.id)
        console.log(req.user.empresaId)
        const reqData = req.body
        try {
            const serviceSave = await serviceService.saveServiceService(reqData, req.user.empresaId, req.user.id)
            res.status(201).json(serviceSave)

        } catch (error:any) {
            console.error(error);
            res.status(500).json({mensagem:"Error no servidor", detalhe:error.message})
        }
    }
    
}