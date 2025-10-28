import { ColaboradorDB } from "../repository/colaboradorRepository.js";
import type { ColaboradorDto } from "../Dtos/colaboradorDto.js";
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

  saveColaboradorService = async (colaboradorDto: ColaboradorDto, empresaId: number) => {
    try {
      
      const senhaAleatoria = this.gerarSenhaAleatoria(10);

      
      const senhaCriptografada = await bcrypt.hash(senhaAleatoria, 10);

      
      const save = await colaboradorDB.saveColaborador(
        { ...colaboradorDto, senha: senhaCriptografada },
        empresaId
      );

      if (!save) throw new Error("Dados não fornecidos corretamente");

      
      return { ...save, senhaGerada: senhaAleatoria };
    } catch (error: any) {
      console.error("Erro ao salvar colaborador:", error.message);
      throw new Error(error.message);
    }
  };

buscarListaDeColaboradoresService = async (empresaId: number) => {
    try {
      const list = await colaboradorDB.buscarListaDeColaboradores(empresaId);
      if (!list) throw new Error("Erro ao buscar Lista");
      return list;
    } catch (error: any) {
      console.error("error:", error.message);
      throw new Error(error.message);
    }
  };
  buscarColaboradorId = async (id:number) =>{
    try{
      const colaborador = await colaboradorDB.buscarColaboradorId(id)
      if(!colaborador){
        throw new Error("Colaborador não encontrado")
      }
      return colaborador
    }catch(error:any){
      console.error("Error ao buscar colaborador" , error.message)
      throw new Error(error.message)
    }
  }

  deleteColaboradorService = async (empresaId:number,colaboradorId:number) =>{
    try{
       const deleteDB = await colaboradorDB.deleteColaboradorId(empresaId,colaboradorId)
      if(!deleteDB){
        throw new Error("Nao foi possivel deletar colaborador ")
      }
      return deleteDB
      }catch(error:any){
      console.error("Erro ao deleta ", error.message)
      throw new Error(error.message)
    }
  }
}
