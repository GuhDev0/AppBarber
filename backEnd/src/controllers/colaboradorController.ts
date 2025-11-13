import { ColaboradorService } from "../services/colaboradorService";
import type { Request, Response } from "express";
const colaboradorService = new ColaboradorService();

export class ColaboradorController {
  saveColaborador = async (req: Request, res: Response) => {
    const reqBody = req.body;

    // Basic validation to avoid calling Prisma with missing required fields
    const empresaId = reqBody.empresaId ?? req.user?.empresaId;
    if (!empresaId) {
      return res.status(400).json({ mensagem: "empresaId é obrigatório" });
    }

    if (!reqBody.nomeCompleto || typeof reqBody.nomeCompleto !== 'string') {
      return res.status(400).json({ mensagem: "nomeCompleto é obrigatório e deve ser uma string" });
    }

    if (!reqBody.email || typeof reqBody.email !== 'string') {
      return res.status(400).json({ mensagem: "email é obrigatório e deve ser uma string" });
    }

    try {
      // ensure empresaId is present in the payload passed to the service
      const payload = { ...reqBody, empresaId };
      // helpful debug log when a request fails validation/server error
      console.debug('Salvar colaborador payload:', payload);

      const save = await colaboradorService.saveColaboradorService(payload);
      res.status(201).json({ mensagem: "Registrado com sucesso", colaborador: save });
    } catch (error: any) {
      console.error('Erro ao salvar colaborador (controller):', error?.message ?? error);
      // If it's a validation-like message from service, return 400, else 500
      const msg = error?.message ?? 'Erro interno';
      if (msg.toLowerCase().includes('empresa não encontrada') || msg.toLowerCase().includes('obrigat')) {
        return res.status(400).json({ mensagem: msg });
      }
      res.status(500).json({ mensagem: msg });
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