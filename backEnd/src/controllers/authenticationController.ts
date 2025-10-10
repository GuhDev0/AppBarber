import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface UsuarioTokenPayload {
  id: number;
  empresaId: number;
  nomeCompleto: string;
  role: string;
}

export class AutheController {
  authetication = (req: Request, res: Response, next: NextFunction) => {
    const tokenAuthe = req.headers["authorization"];

    if (!tokenAuthe) {
      return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    const token = tokenAuthe.startsWith("Bearer ")
      ? tokenAuthe.slice(7)
      : tokenAuthe;

    try {
      const decoded = jwt.verify(
        token,
        process.env.CHAVE_SECRETA as string
      ) 


      next();
    } catch (error) {
      return res.status(401).json({ mensagem: "Token inválido ou expirado" });
    }
  };
}
