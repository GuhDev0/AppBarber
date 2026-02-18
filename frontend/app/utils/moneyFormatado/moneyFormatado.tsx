
export class MoneyFormatado {
  static formatarValorEM_REAL(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  
}    