import { Router } from "express";
import { UserController } from "../controllers/UsuarioController.js";

const userController = new UserController(); 

const router = Router();

router.post('/registrarUsuario', userController.postCreateUser)

export default router