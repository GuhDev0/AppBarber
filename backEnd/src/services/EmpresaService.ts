import { empresaDto } from "../Dtos/empresaDto"; // importa o Zod schema
import type { empresaDto as EmpresaDtoType } from "../Dtos/empresaDto"; // tipo TypeScript
import { Empresa } from "../repository/EmpresaRepository";

const empresaDB = new Empresa();

export class EmpresaService {
  createEmpresaService = async (dados: unknown) => {
    const parsed = empresaDto.safeParse(dados);
    if (!parsed.success) {
      const erros = parsed.error.issues.map(i => i.message).join(", ");
      throw new Error(erros);
    }

    //validando cnpj unico
    const existeCNPJ = await empresaDB.findByCPNJ(parsed.data.cnpj);
    if (existeCNPJ) {
      throw new Error("CNPJ já cadastrado.");
    }

    //validando nome unico
    const existeNomeDaEmpresa =  await empresaDB.findByNome(parsed.data.nomeDaEmpresa);
    if (existeNomeDaEmpresa) {
      throw new Error("Nome da empresa já cadastrado.");
    }
    const existeEmail = await empresaDB.findByEmail(parsed.data.email);
    if (existeEmail) {
      throw new Error("Email já cadastrado.");
    }

    const validData: EmpresaDtoType = parsed.data;
    const empresa = await empresaDB.RegistraEmpresa(validData);
    return empresa;
  };

  empresaFindByIdService = async (id: number) => {
    const empresa = await empresaDB.findByIdEmpresa(id);
    return empresa;
  };

  listaDeEmpresaService = async () => {
    try {
      const listaDB = await empresaDB.buscarListaDeEmpresas();
      return listaDB;
    } catch (error: any) {
      console.error(error.message);
      throw new Error("Erro ao buscar a lista de empresas no banco");
    }
  };
}
