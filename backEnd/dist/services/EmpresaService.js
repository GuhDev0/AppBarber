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
}
//# sourceMappingURL=EmpresaService.js.map