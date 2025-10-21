import { ServiceService } from "../services/ServiceService.js";
import type { Request, Response } from "express";

const serviceService = new ServiceService()

export class ServiceController {


    saveService = async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ mensagem: "Usuário não autenticado" });
        }
        const reqData = req.body
        try {
            const serviceSave = await serviceService.saveServiceService(reqData, req.user.empresaId, req.user.id)
            res.status(201).json(serviceSave)

        } catch (error: any) {
            console.error(error);
            res.status(500).json({ mensagem: "Error no servidor", detalhe: error.message })
        }
    }

    findByIdListService = async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ mensagem: "Usuário não autenticado" });
        }
        try{
             const services = await serviceService.findListService(req.user.empresaId);
                
             res.status(200).json({services})
        }catch(error:any){
            console.error(error.message)
             res.status(500).json({ mensagem: "Error no servidor", detalhe: error.message })
        }

    }

    deleteServiceController = async (req:Request, res:Response) =>{
            const { id } = req.params
            if(id == ""){
               return res.status(400).json({messagem: "Id Não Fornecido"})
            }   
            try{
            
                const deleteService = await serviceService.deleteService(Number(id))    
                res.status(200).json({ message: "Serviço deletado com sucesso" });
            }catch(error:any){
                console.error("Error : " +  error.message)
               res.status(500).json({ message: "Erro no servidor", detalhe: error.message });

            }
    }
}