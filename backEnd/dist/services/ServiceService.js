import { ServiceRepository } from "../repository/serviceReposity.js";
const serviceReposity = new ServiceRepository();
export class ServiceService {
    saveServiceService = async (serviceDTO, empresaId, usuarioId, colaboradorId) => {
        const save = await serviceReposity.createdServiceRepository(serviceDTO, empresaId, usuarioId, colaboradorId);
        console.log(save);
        return save;
    };
    findListService = async (empresaId) => {
        const data = await serviceReposity.findListService(empresaId);
        return data;
    };
    deleteService = async (serviceId) => {
        const deleteService = await serviceReposity.deleteService(serviceId);
        if (!deleteService) {
            throw new Error("service não encontrado");
        }
        return deleteService;
    };
}
//# sourceMappingURL=ServiceService.js.map