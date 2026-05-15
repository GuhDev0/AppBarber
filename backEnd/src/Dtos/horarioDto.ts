export default interface horarioDto {
    id: number;
    diaSemana: ("DOMINGO" | "SEGUNDA" | "TERCA" | "QUARTA" | "QUINTA" | "SEXTA" | "SABADO")[];
    start: Date;  
    end: Date; 
    empresaId: number;
    colaboradorId?: number;
}