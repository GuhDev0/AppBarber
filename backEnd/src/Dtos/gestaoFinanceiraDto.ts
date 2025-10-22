export interface gestaoFinanceiraDto {
  data?: Date;
  hora: string;
  descricao: string;
  formaDePagamento: "PIX" |
                    "DINHEIRO"|
                    "CARTAO";
  tipo: "ENTRADA" | "SAIDA"
  colaboradorId?: number;
  valor: number;
  servicoAssociadoId?: number;
  categoriaId?: number
  nomeCategoria:string
}
