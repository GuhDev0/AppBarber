export class ValidControleDeEntrada {
    valid = (dto) => {
        if (!dto.descricao || !dto.hora || !dto.valor || !dto.formaDePagamento) {
            throw new Error("Campos obrigatórios faltando");
        }
    };
}
//# sourceMappingURL=validControleDeEntrada.js.map