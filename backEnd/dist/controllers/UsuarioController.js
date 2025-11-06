import { UsuarioService } from "../services/usuarioService.js";
import { EmpresaService } from "../services/EmpresaService.js";
const userService = new UsuarioService();
const empresaService = new EmpresaService();
export class UserController {
    postCreateUser = async (req, res) => {
        const dataRequest = req.body;
        try {
            const newUser = await userService.usuarioRegisterService(dataRequest, Number(dataRequest.empresaId));
            res.status(201).json("Registrado Com Sucesso");
        }
        catch (error) {
            res.status(500).json({ mensagem: error.message });
        }
    };
}
