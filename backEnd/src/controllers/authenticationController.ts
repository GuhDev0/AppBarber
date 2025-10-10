import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface UsuarioTokenPayload {
  id: number;
  empresaId: number;
  nomeCompleto: string;
  role: string;
}

// Extendendo o Request pra incluir o usuário
declare global {
  namespace Express {
    interface Request {
      user?: UsuarioTokenPayload;
    }
  }
}

export class AutheController {
  authentication = (req: Request, res: Response, next: NextFunction) => {
    const tokenAuthe = req.headers["authorization"];

    if (!tokenAuthe) {
      return res.status(401).json({ mensagem: "Token não fornecido" });
    }

    // Remove o "Bearer " se existir
    const token = tokenAuthe.startsWith("Bearer ")
      ? tokenAuthe.slice(7)
      : tokenAuthe;

    try {
      // Decodifica o token
      const decoded = jwt.verify(
        token,
        process.env.CHAVE_SECRETA as string
      ) as UsuarioTokenPayload;

      
      req.user = decoded;

      next();
    } catch (error) {
      return res.status(401).json({ mensagem: "Token inválido ou expirado" });
    }
  };
}
