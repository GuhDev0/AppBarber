import type { ControleDeEntradaDTO } from "../Dtos/controleDeEntrada.js";


export class ValidControleDeEntrada{
    valid =  ( dto :ControleDeEntradaDTO ) =>{
    if (!dto.descricao || !dto.hora || !dto.valor || !dto.formaDePagamento) {
    throw new Error("Campos obrigatórios faltando");
      }
    }
}