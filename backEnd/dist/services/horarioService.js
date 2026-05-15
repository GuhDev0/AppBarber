"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HorarioService = void 0;
const HttpError_1 = require("../errors/HttpError");
const agendamentoBarberRepository_1 = require("../repository/agendamentoBarberRepository");
const horarioRepository_1 = require("../repository/horarioRepository");
/** Alinhado ao comentário original do projeto: janelas de agenda em slots de 40 minutos. */
const SLOT_MINUTOS_PADRAO = 40;
const MAPA_DIA_SEMANA = [
    "DOMINGO",
    "SEGUNDA",
    "TERCA",
    "QUARTA",
    "QUINTA",
    "SEXTA",
    "SABADO",
];
function diaSemanaDeData(d) {
    return MAPA_DIA_SEMANA[d.getDay()];
}
function mesclarDataComHora(dia, parteHora) {
    const out = new Date(dia);
    out.setHours(parteHora.getHours(), parteHora.getMinutes(), parteHora.getSeconds(), parteHora.getMilliseconds());
    return out;
}
function intervaloSeSobrepoe(aInicio, aFim, bInicio, bFim) {
    return aInicio < bFim && aFim > bInicio;
}
class HorarioService {
    horarioRepository = new horarioRepository_1.HorarioRepository();
    agendamentoBarberRepository = new agendamentoBarberRepository_1.AgendamentoBarberRepository();
    /**
     * Gera slots consecutivos de `duracaoMinutos` totalmente contidos em [inicio, fim].
     */
    static gerarSlots(inicio, fim, duracaoMinutos) {
        const slots = [];
        let cursor = new Date(inicio);
        while (true) {
            const slotFim = new Date(cursor.getTime() + duracaoMinutos * 60_000);
            if (slotFim > fim)
                break;
            slots.push({ start: new Date(cursor), end: slotFim });
            cursor = slotFim;
        }
        return slots;
    }
    /**
     * Lista horários livres (slots) para um colaborador em um dia civil.
     * Considera agenda cadastrada (`Horario`), agendamentos ativos e bloqueios.
     */
    listarHorariosDisponiveisPorColaborador = async (empresaId, colaboradorId, dataRef, duracaoSlotMinutos = SLOT_MINUTOS_PADRAO) => {
        const data = typeof dataRef === "string" ? new Date(dataRef) : new Date(dataRef);
        if (Number.isNaN(data.getTime())) {
            throw new HttpError_1.HttpError("Data inválida.", 400);
        }
        const colab = await this.agendamentoBarberRepository.buscarColaboradorDaEmpresa(colaboradorId, empresaId);
        if (!colab) {
            throw new HttpError_1.HttpError("Colaborador não encontrado para esta empresa.", 404);
        }
        const inicioDia = new Date(data);
        inicioDia.setHours(0, 0, 0, 0);
        const fimDia = new Date(data);
        fimDia.setHours(23, 59, 59, 999);
        const dia = diaSemanaDeData(inicioDia);
        const horarios = await this.horarioRepository.listarHorariosPorColaborador(colaboradorId, empresaId);
        const horariosDoDia = horarios.filter((h) => h.diaSemana.includes(dia));
        const [ocupados, bloqueios] = await Promise.all([
            this.agendamentoBarberRepository.listarAgendamentosAtivosDoColaboradorNoPeriodo(empresaId, colaboradorId, inicioDia, fimDia),
            this.agendamentoBarberRepository.listarBloqueiosColaboradorNoPeriodo(empresaId, colaboradorId, inicioDia, fimDia),
        ]);
        const livres = [];
        for (const h of horariosDoDia) {
            const janelaInicio = mesclarDataComHora(inicioDia, h.start);
            const janelaFim = mesclarDataComHora(inicioDia, h.end);
            if (janelaFim <= janelaInicio)
                continue;
            const candidatos = HorarioService.gerarSlots(janelaInicio, janelaFim, duracaoSlotMinutos);
            for (const slot of candidatos) {
                const conflitoAg = ocupados.some((o) => intervaloSeSobrepoe(slot.start, slot.end, o.start, o.end));
                const conflitoBl = bloqueios.some((b) => intervaloSeSobrepoe(slot.start, slot.end, b.start, b.end));
                if (!conflitoAg && !conflitoBl) {
                    livres.push({
                        start: slot.start.toISOString(),
                        end: slot.end.toISOString(),
                    });
                }
            }
        }
        livres.sort((a, b) => a.start.localeCompare(b.start));
        return livres;
    };
    criarHorario = async (empresaId, horarioData) => {
        try {
            return await this.horarioRepository.criarHorario(empresaId, horarioData);
        }
        catch (error) {
            console.error("Erro ao criar horário:", error);
            throw new Error("Não foi possível criar o horário.");
        }
    };
    listarHorariosPorColaborador = async (colaboradorId, empresaId) => {
        try {
            return await this.horarioRepository.listarHorariosPorColaborador(colaboradorId, empresaId);
        }
        catch (error) {
            console.error("Erro ao listar horários:", error);
            throw new Error("Não foi possível listar os horários.");
        }
    };
    deleteHorario = async (horarioId, empresaId) => {
        try {
            await this.horarioRepository.deleteHorario(horarioId, empresaId);
        }
        catch (error) {
            console.error("Erro ao deletar horário:", error);
            throw new Error("Não foi possível deletar o horário.");
        }
    };
    updateHorario = async (horarioId, horarioData, empresaId) => {
        try {
            return await this.horarioRepository.updateHorario(horarioId, horarioData, empresaId);
        }
        catch (error) {
            console.error("Erro ao atualizar horário:", error);
            throw new Error("Não foi possível atualizar o horário.");
        }
    };
}
exports.HorarioService = HorarioService;
