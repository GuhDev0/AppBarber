import { Analise } from "../repository/analise";

const analiseDB = new Analise()

export class AnaliseService {
  analiseCompletaPorColaborador = async (empresaId: number, colaboradorId: number) => {

    try {
      const analisePorColaborador = await analiseDB.analiseCompletaPorColaborador(empresaId, colaboradorId)
      if (!analisePorColaborador) {
        throw new Error("Não foi possivel")
      }
      return analisePorColaborador
    } catch (error: any) {
      console.error(error.message)
      throw new Error("Erro ao buscar Analise do colaborador")
    }
  }
  analiseCompletoPorEmpresaService = async (empresaId: number) => {
    try {
      const analisePorEmpresa = await analiseDB.analiseCompletaDoEstabelecimento(empresaId)
      if (!analisePorEmpresa) {
        throw new Error("Não foi possivel")
      }
      return analisePorEmpresa
    } catch (error: any) {
      console.error(error.message)
      throw new Error("Erro ao buscar Analise da empresa")
    }
  }
}