import { Router } from "express";
import { UserController } from "../controllers/UsuarioController.js";
import { LoginController } from "../controllers/loginController.js";
import { AutheController } from "../controllers/authenticationController.js";
import { EmpresaController } from "../controllers/empresaController.js";
import { ServiceController } from "../controllers/serviceControler.js";
import { ControleDeEntradaController } from "../controllers/controleDeEntrada.js";
const userController = new UserController(); 
const loginController = new LoginController();
const empresaController = new EmpresaController();
const autheController = new AutheController();
const serviceControler = new ServiceController();
const controleDeEntradaController = new ControleDeEntradaController() 
const router = Router();

router.post('/registrarUsuario', userController.postCreateUser)
router.post('/login', loginController.login)
router.post("/createEmpresa",empresaController.empresaCreate)
router.post('/serviceSave', autheController.authentication,serviceControler.saveService)
router.post('/saveEntrada',autheController.authentication,controleDeEntradaController.saveEntrada)

router.get("/dashboart",autheController.authentication)
router.get('/findListServices', autheController.authentication, serviceControler.findByIdListService)
router.get('/findByEmpresaId/:id', empresaController.buscarPeloId)


router.delete('/deleteService/:id',serviceControler.deleteServiceController)

export default router