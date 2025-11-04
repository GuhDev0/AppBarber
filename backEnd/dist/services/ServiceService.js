import { ServiceRepository } from "../repository/serviceReposity.js";
import { PagamentoRepository } from "../repository/pagamentoRepository.js";
const serviceReposity = new ServiceRepository();
const pagamentoDB = new PagamentoRepository();
export class ServiceService {
    saveServiceService = async (serviceDTO, empresaId, usuarioId, colaboradorId) => {
        try {
            const save = await serviceReposity.createdServiceRepository(serviceDTO, empresaId, usuarioId, colaboradorId);
            if (!save?.id) {
                throw new Error("Serviço não foi salvo corretamente.");
            }
            await pagamentoDB.registrarPagamento(empresaId, colaboradorId, save.id);
            console.log(save);
            return save;
        }
        catch (error) {
            console.error("Erro ao salvar serviço ou registrar pagamento:", error);
            throw error;
        }
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