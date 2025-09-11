import type usuarioDto from "../Dtos/usuarioDto.js";
import UsuarioRepository from "../repository/usuarioRepository.js";

const usuarioDb = new UsuarioRepository();

export class UsuarioService{
   usuarioRegisterService = async (UsuarioDto : usuarioDto) => {
        const user =  usuarioDb.registrarUsuario(UsuarioDto)
        return user
     }
}
