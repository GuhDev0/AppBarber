import { prisma } from "../prisma";
import horarioDto from "../Dtos/horarioDto";

export class HorarioRepository {

    criarHorario = async (empresaId: number, horarioData: horarioDto) => {
    
       
        try {
            const horario = await prisma.horario.create({
                data: {
                    start: horarioData.start,
                    end: horarioData.end,
                    empresaId: empresaId,
                    diaSemana: horarioData.diaSemana,
                    colaboradorId: horarioData.colaboradorId ?? undefined,
                },
            });

            return horario;
        } catch (error) {
            console.error("Erro ao criar horário:", error);
            throw new Error("Não foi possível criar o horário.");
        }
    }
    listarHorariosPorColaborador = async (colaboradorId: number,empresaId: number) => {
        try {
            const horarios = await prisma.horario.findMany({
                where: { colaboradorId, empresaId },
            });
            return horarios;
        } catch (error) {
            console.error("Erro ao listar horários:", error);
            throw new Error("Não foi possível listar os horários.");
        }
    }
    deleteHorario = async (horarioId: number, empresaId: number) => {
        try {
            await prisma.horario.deleteMany({
                where: { id: horarioId, empresaId: empresaId },
            });
        } catch (error) {
            console.error("Erro ao deletar horário:", error);
            throw new Error("Não foi possível deletar o horário.");
        }
    }
    updateHorario = async (horarioId: number, horarioData: horarioDto, empresaId: number) => {
        try {
            await prisma.horario.updateMany({
                where: { id: horarioId, empresaId: empresaId },
                data: {
                    start: horarioData.start,
                    end: horarioData.end,
                }
            });
            const horario = await prisma.horario.findFirst({
                where: { id: horarioId, empresaId },
            });
            return horario;
        } catch (error) {
            console.error("Erro ao atualizar horário:", error);
            throw new Error("Não foi possível atualizar o horário.");
        }
    }
}