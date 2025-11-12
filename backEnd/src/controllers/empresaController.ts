import { EmpresaService } from "../services/EmpresaService.js";
import type { Response, Request } from "express";
const empresaService = new EmpresaService();

export class EmpresaController {
  
  empresaCreate = async (req: Request, res: Response) => {
    const empresaReq = req.body;
    try {
      const empresaCreate = await empresaService.createEmpresaService(empresaReq);
      return res.status(201).json(empresaCreate);
    } catch (error: any) {
      return res.status(500).json({ mensagem: error.message });
    }
  };

  
  buscarPeloId = async (req: Request, res: Response) => {
    const { id } = req.params; 
    const empresaId = Number(id);

    if (isNaN(empresaId)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }

    try {
      const empresa = await empresaService.empresaFindByIdService(empresaId);

      if (!empresa) {
        return res.status(404).json({ mensagem: "Empresa não encontrada" });
      }

      return res.status(200).json(empresa);
    } catch (error: any) {
      return res.status(500).json({ mensagem: error.message });
    }
  };
  listaDeEmpresasController = async(req:Request, res:Response) =>{
    try{
      const listaEmprestaService = await empresaService.listaDeEmpresaService()
      res.status(200).json({mensagem:listaEmprestaService})
    }catch(error:any){
        res.status(500).json({error:error.mensagem})
    }
  }
}
