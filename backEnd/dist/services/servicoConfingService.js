"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicoConfigService = void 0;
const servicoConfigRepository_1 = require("../repository/servicoConfigRepository");
const servicoConfigRepository = new servicoConfigRepository_1.ServicoConfingRepository;
class ServicoConfigService {
    registraServiceCatalago = async (catalaoServiceDto, empresaId) => {
        try {
            const registraNoDB = await servicoConfigRepository.registraServiceCatalago(catalaoServiceDto, empresaId);
            if (catalaoServiceDto.nome === " ") {
                throw new Error("Por favor informe o nome do serviço ");
            }
            return registraNoDB;
        }
        catch (error) {
            console.error(error.message);
            throw new Error(error.message);
        }
    };
    buscarListaDeServices = async (empresaId) => {
        try {
            const listDB = await servicoConfigRepository.buscarListaDeServico(empresaId);
            return listDB;
        }
        catch (error) {
            console.error({ mensagem: "Erro ao encontra lista de serviços", Detalhe: error.message });
            throw new Error(error.message);
        }
    };
    deleteServiceId = async (empresaId, idService) => {
        try {
            const deletarDB = await servicoConfigRepository.deleteServico(empresaId, idService);
            if (isNaN(Number(idService))) {
                throw new Error("Por favor informe um id ");
            }
            return deletarDB;
        }
        catch (error) {
            throw new Error(error.message);
        }
    };
}
exports.ServicoConfigService = ServicoConfigService;
