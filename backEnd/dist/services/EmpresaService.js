import { Empresa } from "../repository/EmpresaRepository.js";
const empresaDB = new Empresa();
export class EmpresaService {
    createEmpresaService = async (empresaDto) => {
        const empresa = await empresaDB.RegistraEmpresa(empresaDto);
        return empresa;
    };
    empresaFindByIdService = async (id) => {
        const empresaId = await empresaDB.findByIdEmpresa(id);
        return empresaId;
    };
    listaDeEmpresaService = async () => {
        try {
            const listaDB = empresaDB.buscarListaDeEmpresas();
            return listaDB;
        }
        catch (error) {
            throw new Error("Erro busca a lista de empresas no banco");
            console.error(error.message);
        }
    };
}
