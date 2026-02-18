import { LoginRepository } from "../repository/loginRepository"
import type { loginDto } from "../Dtos/loginDto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import bcrypt from "bcrypt"
dotenv.config()
const loginRepository = new LoginRepository();
const cs =  process.env.CHAVE_SECRETA as string
export class LoginService {
    login = async (loginDto: loginDto) => {
       
    
        try {
            const usuario = await loginRepository.findByEmail(loginDto);
            if (!usuario){
              throw new Error("Usuario não Encontrado")
            }
            const validarSenha = await bcrypt.compare(loginDto.loginSenha,usuario.senha);

            if(!validarSenha){
              throw new Error("Senha Incorreta")
            }
            const payload = {
                id: usuario.id,
                name: usuario.nomeCompleto,
                telefone:usuario.telefone,
                email:usuario.email,
                role: usuario.tipoDaConta,
                empresaId:usuario.empresaId,
                nameEmpresa:usuario.empresa.nomeDaEmpresa,

            
            }
            
            const token = jwt.sign(payload, cs, { expiresIn: "24h" })
            const {senha, ...usuarioSemSenha} = usuario;
            return{token, usuario:usuarioSemSenha}    
        }catch(error:any){
            throw new Error(error.message || "Erro no Login")
        }
    }


}

