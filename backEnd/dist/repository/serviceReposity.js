import { PrismaClient } from "../../generated/prisma/index.js";
const prisma = new PrismaClient();
export class ServiceRepository {
    createdServiceRepository = async (serviceDTO, empresaId, usuarioId, colaboradorId) => {
        const saveServiceDB = await prisma.servico.create({
            data: {
                tipoDoServico: serviceDTO.tipoDoServico,
                valorDoServico: serviceDTO.valorDoServico,
                barbeiro: serviceDTO.barbeiro,
                data: new Date(serviceDTO.data),
                hora: serviceDTO.hora,
                empresaId,
                usuarioId,
                colaboradorId
            }
        });
        return saveServiceDB;
    };
    findListService = async (empresaId) => {
        try {
            const list = await prisma.servico.findMany({
                where: { empresaId }
            });
            return list;
        }
        catch (error) {
            console.error(error.message);
            throw new Error("Erro ao buscar Lista");
        }
    };
    deleteService = async (serviceId) => {
        const deleteService = await prisma.servico.delete({
            where: {
                id: serviceId
            }
        });
        return deleteService;
    };
}
//# sourceMappingURL=serviceReposity.js.map