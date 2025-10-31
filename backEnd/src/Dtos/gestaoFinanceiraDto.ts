export interface gestaoFinanceiraDto {
  data?: Date;
  hora: string;
  descricao: string;
  formaDePagamento: "PIX" |
                    "DINHEIRO"|
                    "CARTAO";
  tipo:   "SAIDA"
  colaboradorId?: number;
  valor: number;
  servicoAssociadoId?: number;
  categoriaId?: number
  nomeCategoria:string
}
