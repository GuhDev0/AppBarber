import type { ControleDeEntradaDTO } from "../Dtos/gestaoFinanceiraDto.js";


export class ValidControleDeEntrada{
    valid =  ( dto :ControleDeEntradaDTO ) =>{
    if (!dto.descricao || !dto.hora || !dto.valor || !dto.formaDePagamento) {
    throw new Error("Campos obrigatórios faltando");
      }
    }
}