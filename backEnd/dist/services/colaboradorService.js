import { ColaboradorDB } from "../repository/colaboradorRepository.js";
import bcrypt from "bcrypt"; // para criptografar a senha
const colaboradorDB = new ColaboradorDB();
export class ColaboradorService {
    gerarSenhaAleatoria = (tamanho = 8) => {
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
        let senha = "";
        for (let i = 0; i < tamanho; i++) {
            const indice = Math.floor(Math.random() * caracteres.length);
            senha += caracteres[indice];
        }
        return senha;
    };
    saveColaboradorService = async (colaboradorDto, empresaId) => {
        try {
            const senhaAleatoria = this.gerarSenhaAleatoria(10);
            const senhaCriptografada = await bcrypt.hash(senhaAleatoria, 10);
            const save = await colaboradorDB.saveColaborador({ ...colaboradorDto, senha: senhaCriptografada }, empresaId);
            if (!save)
                throw new Error("Dados não fornecidos corretamente");
            return { ...save, senhaGerada: senhaAleatoria };
        }
        catch (error) {
            console.error("Erro ao salvar colaborador:", error.message);
            throw new Error(error.message);
        }
    };
    buscarListaDeColaboradoresService = async (empresaId) => {
        try {
            const list = await colaboradorDB.buscarListaDeColaboradores(empresaId);
            if (!list)
                throw new Error("Erro ao buscar Lista");
            return list;
        }
        catch (error) {
            console.error("error:", error.message);
            throw new Error(error.message);
        }
    };
}
//# sourceMappingURL=colaboradorService.js.map