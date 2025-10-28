import { ColaboradorService } from "../services/colaboradorService.js";
import type { Request, Response } from "express";
const colaboradorService = new ColaboradorService

export class ColaboradorController {
    saveColaborador = async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ mensagem: "Usuário não autenticado" });
        }
        const reqBody = req.body
        try {
            const save = await colaboradorService.saveColaboradorService(reqBody, req.user.empresaId)
            res.status(201).json({
                mensagem: "Registrado com sucesso"
            })

        } catch (error: any) {
            res.status(500).json(error.message)
        }

    }
    buscaColaborador = async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ mensagem: "Usuário não autenticado" });
        }
        try {
            const list = await colaboradorService.buscarListaDeColaboradoresService(req.user.empresaId)
            res.status(200).json({
                list
            })

        } catch (error: any) {
            res.status(500).json("não foi possivel encontra a lista de colaborador")
        }
    }
  deleteColaboradorId = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ mensagem: "token inválido" });
  }

  const empresaId = req.user.empresaId;
  const idReq = Number(req.params.id); 

  if (isNaN(idReq)) {
    return res.status(400).json({ mensagem: "ID inválido" });
  }

  try {
    const deletado = await colaboradorService.deleteColaboradorService(empresaId, idReq);
    return res.status(200).json({ mensagem: "Colaborador deletado com sucesso", deletado });
  } catch (erro) {
    return res.status(500).json({ mensagem: "Erro ao deletar colaborador", erro });
  }
};


}