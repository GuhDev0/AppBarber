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
                mensagem: "Registrado com sucesso",
                colaborador: save
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
            const list = await colaboradorService.buscarColaboradorService(req.user.empresaId)
            res.status(200).json({
                mensagem: "Lista de colaboradores encontrada com sucesso",
                colaboradores: list
            })

        } catch (error: any) {
            res.status(500).json("não foi possivel encontra a lista de colaborador")
        }
    }
}