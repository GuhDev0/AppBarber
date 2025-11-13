"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const usuarioService_1 = require("../services/usuarioService");
const EmpresaService_1 = require("../services/EmpresaService");
const userService = new usuarioService_1.UsuarioService();
const empresaService = new EmpresaService_1.EmpresaService();
class UserController {
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
exports.UserController = UserController;
