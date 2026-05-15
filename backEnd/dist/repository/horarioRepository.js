"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorarioRepository = void 0;
const prisma_1 = require("../prisma");
class HorarioRepository {
    criarHorario = async (empresaId, horarioData) => {
        try {
            const horario = await prisma_1.prisma.horario.create({
                data: {
                    start: horarioData.start,
                    end: horarioData.end,
                    empresaId: empresaId,
                    diaSemana: horarioData.diaSemana,
                    colaboradorId: horarioData.colaboradorId ?? undefined,
                },
            });
            return horario;
        }
        catch (error) {
            console.error("Erro ao criar horário:", error);
            throw new Error("Não foi possível criar o horário.");
        }
    };
    listarHorariosPorColaborador = async (colaboradorId, empresaId) => {
        try {
            const horarios = await prisma_1.prisma.horario.findMany({
                where: { colaboradorId, empresaId },
            });
            return horarios;
        }
        catch (error) {
            console.error("Erro ao listar horários:", error);
            throw new Error("Não foi possível listar os horários.");
        }
    };
    deleteHorario = async (horarioId, empresaId) => {
        try {
            await prisma_1.prisma.horario.deleteMany({
                where: { id: horarioId, empresaId: empresaId },
            });
        }
        catch (error) {
            console.error("Erro ao deletar horário:", error);
            throw new Error("Não foi possível deletar o horário.");
        }
    };
    updateHorario = async (horarioId, horarioData, empresaId) => {
        try {
            await prisma_1.prisma.horario.updateMany({
                where: { id: horarioId, empresaId: empresaId },
                data: {
                    start: horarioData.start,
                    end: horarioData.end,
                }
            });
            const horario = await prisma_1.prisma.horario.findFirst({
                where: { id: horarioId, empresaId },
            });
            return horario;
        }
        catch (error) {
            console.error("Erro ao atualizar horário:", error);
            throw new Error("Não foi possível atualizar o horário.");
        }
    };
}
exports.HorarioRepository = HorarioRepository;
