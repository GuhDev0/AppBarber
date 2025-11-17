"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginTestes = void 0;
const loginRepository_1 = require("../repository/loginRepository");
const loginRepo = new loginRepository_1.LoginRepository();
const email = "admin@admin.com";
const senha = "admin123";
class loginTestes {
    loginTeste = async (email) => {
        const login = await loginRepo.findByEmail({ loginEmail: email, loginSenha: senha });
        console.log("Login encontrado:", login);
    };
}
exports.loginTestes = loginTestes;
