import { ClienteService } from "../services/clienteService.js";
import type{ Request,Response } from "express";

const clienteService = new ClienteService()

export class ClienteController{
  criarClienteController = async (req:Request,res:Response) =>{
    if(!req.user){
      return res.status(401).json("Token Invalido")
    }
    const reqCliente = req.body
    try{
      const cliente = await clienteService.criarCliente(reqCliente,req.user.empresaId)
      res.status(201).json({mensagem:"cliente Registrado com sucesso", cliente})
    }catch(error:any){
      res.status(500).json({ mensagem:"Erro no servidor" , error:error.message})
    }
  }
  listaDeClienteController = async (req:Request,res:Response) =>{
    try{
       if(!req.user){
      return res.status(401).json("Token Invalido")
    }
      const lista = await clienteService.listaDeCliente(req.user.empresaId)
      res.status(200).json(lista)
    }catch(error:any){
      res.status(500).json({mensagem:"Erro no servidor", detalhe:error.message})
    }
  }
  deleteClientePeloId = async (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ mensagem: "ID inválido, informe um ID válido." });
  }

  if (!req.user) {
    return res.status(401).json({ mensagem: "Token inválido ou ausente." });
  }

  try {
    const deleteResult = await clienteService.deleteCliente( req.user.empresaId,id);

    return res
      .status(200)
      .json({ mensagem: "Cliente deletado com sucesso.", deleteResult });

  } catch (error: any) {
    console.error(error.message);

    if (error.message.includes("não encontrado")) {
      return res.status(404).json({
        mensagem: "Erro ao deletar cliente",
        detalhe: error.message
      });
    }

    return res.status(500).json({
      mensagem: "Erro interno ao deletar cliente",
      detalhe: error.message
    });
  }
};

}