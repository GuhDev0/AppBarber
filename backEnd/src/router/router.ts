import { Router } from "express";
import { UserController } from "../controllers/UsuarioController.js";
import { LoginController } from "../controllers/loginController.js";
import { AutheController } from "../controllers/authenticationController.js";
import { EmpresaController } from "../controllers/empresaController.js";

const userController = new UserController(); 
const loginController = new LoginController();
const empresaController = new EmpresaController();
const autheController = new AutheController()
const router = Router();

router.post('/registrarUsuario', userController.postCreateUser)
router.post('/login', loginController.login)
router.get("/dashboart",autheController.authetication)
router.post("/createEmpresa",empresaController.empresaCreate)
router.get('/findByEmpresaId/:id', empresaController.buscarPeloId)

export default router