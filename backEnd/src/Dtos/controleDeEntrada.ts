export interface ControleDeEntradaDTO {
  data?: Date; 
  hora: string;
  descricao: string;
  formaDePagamento: string;
  barbeiroResponsavel?: string; 
  valor: number;
  servicoAssociadoId?: number; 
}
