import { LoginService } from "../services/loginService.js";
import jwt from "jsonwebtoken";
import { UsuarioService } from "../services/usuarioService.js";
const loginService = new LoginService();
export class LoginController {
    login = async (req, res) => {
        const requisiçãoLogin = req.body;
        try {
            const usuarioService = await loginService.login(requisiçãoLogin);
            res.status(200).json(usuarioService);
        }
        catch (error) {
            res.status(500).json({ mensangem: error.message });
        }
    };
}
//# sourceMappingURL=loginController.js.map