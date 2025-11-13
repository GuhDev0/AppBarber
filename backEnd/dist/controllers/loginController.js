"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const loginService_1 = require("../services/loginService");
const loginService = new loginService_1.LoginService();
class LoginController {
    login = async (req, res) => {
        const requisiçãoLogin = req.body;
        try {
            const usuarioService = await loginService.login(requisiçãoLogin);
            res.status(200).json(usuarioService);
        }
        catch (error) {
            console.error('Erro no login:', error.message);
            return res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    };
}
exports.LoginController = LoginController;
