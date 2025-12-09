"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutheController = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AutheController {
    authentication = (req, res, next) => {
        const tokenAuthe = req.headers["authorization"];
        if (!tokenAuthe) {
            return res.status(401).json({ mensagem: "Token não fornecido" });
        }
        const token = tokenAuthe.startsWith("Bearer ")
            ? tokenAuthe.slice(7)
            : tokenAuthe;
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.CHAVE_SECRETA);
            req.user = decoded;
            next();
        }
        catch (error) {
            return res.status(401).json({ mensagem: "Token inválido ou expirado" });
        }
    };
}
exports.AutheController = AutheController;
