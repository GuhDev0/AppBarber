import jwt from "jsonwebtoken";
export class AutheController {
    authentication = (req, res, next) => {
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
            const decoded = jwt.verify(token, process.env.CHAVE_SECRETA);
            req.user = decoded;
            next();
        }
        catch (error) {
            return res.status(401).json({ mensagem: "Token inválido ou expirado" });
        }
    };
}
//# sourceMappingURL=authenticationController.js.map