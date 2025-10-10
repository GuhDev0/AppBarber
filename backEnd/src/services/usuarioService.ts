import type { loginDto } from "../Dtos/loginDto.js";
import type usuarioDto from "../Dtos/usuarioDto.js";
import UsuarioRepository from "../repository/usuarioRepository.js";
import { Empresa } from "../repository/EmpresaRepository.js";
import { EmpresaService } from "./EmpresaService.js";
const usuarioDb = new UsuarioRepository();
const empresaServicee = new EmpresaService();



export class UsuarioService {


   usuarioRegisterService = async (UsuarioDto: usuarioDto, empresaId: number) => {
      
      const user = (await usuarioDb.registrarUsuario(UsuarioDto, empresaId))
      return user
   }


}
