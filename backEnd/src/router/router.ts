import { Router } from "express";
import { UserController } from "../controllers/UsuarioController.js";
import { LoginController } from "../controllers/loginController.js";
import { AutheController } from "../controllers/authenticationController.js";
import { EmpresaController } from "../controllers/empresaController.js";
import { ServiceController } from "../controllers/serviceControler.js";
const userController = new UserController(); 
const loginController = new LoginController();
const empresaController = new EmpresaController();
const autheController = new AutheController()
const serviceControler = new ServiceController()
const router = Router();

router.post('/registrarUsuario', userController.postCreateUser)
router.post('/login', loginController.login)
router.get("/dashboart",autheController.authentication)
router.post("/createEmpresa",empresaController.empresaCreate)
router.get('/findByEmpresaId/:id', empresaController.buscarPeloId)
router.post('/serviceSave', autheController.authentication,serviceControler.saveService)
router.get('/findListServices', autheController.authentication, serviceControler.findByIdListService)
router.delete('/deleteService/:id',serviceControler.deleteServiceController)
export default router