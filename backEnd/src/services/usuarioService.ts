import type usuarioDto from "../Dtos/usuarioDto";
import UsuarioRepository from "../repository/usuarioRepository";
import { ColaboradorService } from "./colaboradorService";
import type { ColaboradorDto } from "../Dtos/colaboradorDto";
import { ClienteService } from "./clienteService";
import { ClienteDto } from "../Dtos/clienteDto";
const usuarioDb = new UsuarioRepository();
const colaboradorService = new ColaboradorService();
const clienteService = new ClienteService();

export class UsuarioService {

  usuarioRegisterService = async (UsuarioDto: usuarioDto, empresaId: number) => {
    try {
      
      const user = await usuarioDb.registrarUsuario(UsuarioDto, empresaId);

      
      const adminDto: ColaboradorDto = {
        nomeCompleto: "ADMIN",
        email: UsuarioDto.email,
        dataNascimento: "",
        empresaId: empresaId,
        tel: UsuarioDto.telefone,
        senha: "",          
        avatar: ""
      };
   
      const adminColaborador = await colaboradorService.saveColaboradorService(adminDto);

      return { user }; 
    } catch (error: any) {
      console.error("Erro ao registrar usuário:", error.message);
      throw new Error(error.message);
    }
  };
}
