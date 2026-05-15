import { Router } from "express";
import { UserController } from "../controllers/UsuarioController";
import { LoginController } from "../controllers/loginController";
import { AutheController } from "../controllers/authenticationController";
import { EmpresaController } from "../controllers/empresaController";
import { ServiceController } from "../controllers/serviceControler";
import { ColaboradorController } from "../controllers/colaboradorController";
import { CategoriaController } from "../controllers/categoriaController";
import {ServicoConfigController} from "../controllers/servicoConfigController"
import { ClienteController } from "../controllers/clienteController";
import { AnaliseController } from "../controllers/analiseController";
import { AgendamentoBarberController } from "../controllers/agendamentoController";
import { HorarioController } from "../controllers/horarioController";

const userController = new UserController(); 
const loginController = new LoginController();
const empresaController = new EmpresaController();
const autheController = new AutheController();
const serviceControler = new ServiceController(); 
const colaboradorController = new ColaboradorController()
const categoriaController = new CategoriaController()
const servicoConfigController = new ServicoConfigController();
const clienteController  = new ClienteController();
const analiseController = new AnaliseController();
const agendamentoBarberController = new AgendamentoBarberController();
const horarioController = new HorarioController();
const router = Router();

router.post('/registrarUsuario', userController.postCreateUser)
router.post('/login', loginController.login)
router.post("/createEmpresa",empresaController.empresaCreate)
router.post('/serviceSave', autheController.authentication,serviceControler.saveService)
router.post("/saveColaborador",autheController.authentication,colaboradorController.saveColaborador)
router.post("/registraCatalagoService", autheController.authentication,servicoConfigController.registraCatalagoServicoControler)
router.post("/cadastroDeCliente",autheController.authentication,clienteController.criarClienteController)
router.post("/criarHorario",autheController.authentication,horarioController.criarHorario)
router.post("/criarAgendamento",autheController.authentication,agendamentoBarberController.criarAgendamento)


router.get("/verificaEmpresaCnpj", empresaController.verificaEmpresaPorCnpj)
router.get('/buscarAnaliseEstabelecimento', autheController.authentication, analiseController.analisePorEmpresa)
router.get('/buscarAnalisePorColaborador/:id',autheController.authentication,analiseController.analisePorColaborador)
router.get("/dashboart",autheController.authentication)
router.get('/findListServices', autheController.authentication, serviceControler.findByIdListService)
router.get('/findByEmpresaId/:id', empresaController.buscarPeloId)
router.get("/listColaboradores",autheController.authentication,colaboradorController.buscaColaborador)
router.get("/listCATEGORIA",autheController.authentication,categoriaController.listCategoriaController )
router.get("/listDeCatalagoDeServico",autheController.authentication,servicoConfigController.buscarListaDeControler)
router.get("/listaDeClientes",autheController.authentication,clienteController.listaDeClienteController)
router.get("/listaDeEmpresas", autheController.authentication , empresaController.listaDeEmpresasController)
router.get("/listarAgendamento",autheController.authentication,agendamentoBarberController.listarAgendamento)
router.get("/listarHorariosPorColaborador/:id",autheController.authentication,horarioController.listarHorariosPorColaborador)
router.get("/horariosDisponiveis/:id",autheController.authentication,horarioController.listarHorariosDisponiveisPorColaborador)

router.delete('/deleteService/:id',serviceControler.deleteServiceController)
router.delete("/deleteColaborador/:id",autheController.authentication,colaboradorController.deleteColaboradorId)
router.delete("/deletaServico/:id",autheController.authentication,servicoConfigController.deleteServicoControler)
router.delete("/deletarCliente/:id",autheController.authentication,clienteController.deleteClientePeloId)
router.delete("/deleteHorario/:id",autheController.authentication,horarioController.deleteHorario)
router.delete("/deleteAgendamento/:id",autheController.authentication,agendamentoBarberController.deleteAgendamento)

router.put("/updateHorario/:id",autheController.authentication,horarioController.updateHorario)
export default router