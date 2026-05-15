export interface agendamentoDto {
  
  startTime: Date | string;
  endTime?: Date | string;
  clienteId: number;
  colaboradorId: number;
  servicoConfigId: number;
}
