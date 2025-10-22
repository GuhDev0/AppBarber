import { Empresa } from "../repository/EmpresaRepository.js";
import { GestaoFinanceiraService } from "../services/gestaoFinanceiraService.js";
import type { Request, Response } from "express";
const gestaoFinanceiraService = new GestaoFinanceiraService()


export class GestaoFinanceiraController {
    saveLancamento = async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ mensagem: "Token invalido" })
        }
        const reqEntrada = req.body
        try {

            if (!reqEntrada) {
                res.status(400).json("Dados incorretos")
            }
            const lancamento = await gestaoFinanceiraService.saveLancamentoService(reqEntrada, req.user.empresaId)
            return res.status(201).json("Registrado Com Sucesso ")
        } catch (error: any) {
            console.error(error.message)
            return res.status(500).json({ message: error.message })
        }
    }
    listLancamento = async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ mensagem: "Token invalido" })
        }
        try {
            const list = await gestaoFinanceiraService.buscarListaDelancamentosService(req.user.empresaId)
            res.status(200).json({
                mensagem: " Lista De Lançamentos: ",
                lista: list
            })
        } catch (error: any) {
            res.status(500).json(error.message)
        }
    }
    deleteLancamento = async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({ mensagem: "Usuário não autenticado" });
        }
        try {


            const id = Number(req.params.id);
            if (isNaN(id)) return res.status(400).json({ mensagem: "ID inválido" });
            
            const lancamento = await gestaoFinanceiraService.buscarListaDelancamentosService(req.user.empresaId);
            const lanc = lancamento.find((l: any) => l.id === id);
            if (!lanc) return res.status(404).json({ mensagem: "Lançamento não encontrado" });

            
            const deletado = await gestaoFinanceiraService.deleteLancamentoService(id,req.user.empresaId);

            res.status(200).json({ mensagem: "Lançamento deletado com sucesso", deletado });
        } catch (error: any) {
            console.error(error);
            res.status(500).json({ mensagem: "Erro ao deletar lançamento", erro: error.message });
        }
    };
}