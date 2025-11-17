import { LoginRepository } from "../repository/loginRepository";

const loginRepo = new LoginRepository();
const email = "admin@admin.com";
const senha = "admin123";


export class loginTestes {
    loginTeste = async (email:string) => {
        const login = await loginRepo.findByEmail({loginEmail:email, loginSenha:senha});
        console.log("Login encontrado:", login);   
    }
}