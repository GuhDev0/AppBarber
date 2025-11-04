import { Router } from "express";
import { UserController } from "../controllers/UsuarioController.js";
import { LoginController } from "../controllers/loginController.js";
import { AutheController } from "../controllers/authenticationController.js";
import { EmpresaController } from "../controllers/empresaController.js";
import { ServiceController } from "../controllers/serviceControler.js";
import { GestaoFinanceiraController } from "../controllers/gestaoFinanceiraController.js";
import { ColaboradorController } from "../controllers/colaboradorController.js";
import { CategoriaController } from "../controllers/categoriaController.js";
import {ServicoConfigController} from "../controllers/servicoConfigController.js"
import { ClienteController } from "../controllers/clienteController.js";

const userController = new UserController(); 
const loginController = new LoginController();
const empresaController = new EmpresaController();
const autheController = new AutheController();
const serviceControler = new ServiceController();
const gestaoFinanceiraController = new GestaoFinanceiraController() 
const colaboradorController = new ColaboradorController()
const categoriaController = new CategoriaController()
const servicoConfigController = new ServicoConfigController();
const clienteController  = new ClienteController();

const router = Router();

router.post('/registrarUsuario', userController.postCreateUser)
router.post('/login', loginController.login)
router.post("/createEmpresa",empresaController.empresaCreate)
router.post('/serviceSave', autheController.authentication,serviceControler.saveService)
router.post('/saveLancamento',autheController.authentication,gestaoFinanceiraController.saveLancamento)
router.post("/saveColaborador",autheController.authentication,colaboradorController.saveColaborador)
router.post("/registraCatalagoService", autheController.authentication,servicoConfigController.registraCatalagoServicoControler)
router.post("/cadastroDeCliente",autheController.authentication,clienteController.criarClienteController)


router.get("/dashboart",autheController.authentication)
router.get('/findListServices', autheController.authentication, serviceControler.findByIdListService)
router.get('/findByEmpresaId/:id', empresaController.buscarPeloId)
router.get("/listColaboradores",autheController.authentication,colaboradorController.buscaColaborador)
router.get("/listaDeLancamento",autheController.authentication,gestaoFinanceiraController.listLancamento)
router.get("/listCATEGORIA",autheController.authentication,categoriaController.listCategoriaController )
router.get("/listDeCatalagoDeServico",autheController.authentication,servicoConfigController.buscarListaDeControler)
router.get("/listaDeClientes",autheController.authentication,clienteController.listaDeClienteController)


router.delete('/deleteService/:id',serviceControler.deleteServiceController)
router.delete("/deleteLancamento/:id",autheController.authentication,gestaoFinanceiraController.deleteLancamento)
router.delete("/deleteColaborador/:id",autheController.authentication,colaboradorController.deleteColaboradorId)
router.delete("/deletaServico/:id",autheController.authentication,servicoConfigController.deleteServicoControler)
router.delete("/deletarCliente/:id",autheController.authentication,clienteController.deleteClientePeloId)
export default router