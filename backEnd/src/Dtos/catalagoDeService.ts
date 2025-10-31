export interface catalagoServiceDto {
  nome: string;        
  tipo: "Pacote" | "Simples" | "Combo";
           
  preco: number;       
  comissao: number;     
}
