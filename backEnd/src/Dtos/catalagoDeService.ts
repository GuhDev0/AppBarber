export interface catalagoServiceDto {
  nome: string;        
  tipo: "Pacote" | "Simples" | "Combo";
  duracaoDoServico: number;         
  preco: number;       
  comissao: number;     
}
