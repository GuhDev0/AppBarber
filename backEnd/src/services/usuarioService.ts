import type { loginDto } from "../Dtos/loginDto";
import type usuarioDto from "../Dtos/usuarioDto";
import UsuarioRepository from "../repository/usuarioRepository";
import { Empresa } from "../repository/EmpresaRepository";
import { EmpresaService } from "./EmpresaService";
const usuarioDb = new UsuarioRepository();
const empresaServicee = new EmpresaService();



export class UsuarioService {


   usuarioRegisterService = async (UsuarioDto: usuarioDto, empresaId: number) => {
      
      const user = (await usuarioDb.registrarUsuario(UsuarioDto, empresaId))
      return user
   }


}
