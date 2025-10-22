import UsuarioRepository from "../repository/usuarioRepository.js";
import { Empresa } from "../repository/EmpresaRepository.js";
import { EmpresaService } from "./EmpresaService.js";
const usuarioDb = new UsuarioRepository();
const empresaServicee = new EmpresaService();
export class UsuarioService {
    usuarioRegisterService = async (UsuarioDto, empresaId) => {
        const user = (await usuarioDb.registrarUsuario(UsuarioDto, empresaId));
        return user;
    };
}
//# sourceMappingURL=usuarioService.js.map