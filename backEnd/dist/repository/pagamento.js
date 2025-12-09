"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagamentoRepository = void 0;
const prismaClient_1 = require("../prismaClient");
class PagamentoRepository {
    props;
    constructor(props) {
        this.props = props;
    }
    createPagamento = async (empresaId) => {
        const create = await prismaClient_1.prisma.pagamento.create({
            data: {
                nomeDoColaborador: this.props.nomeDoColaborador,
                totalDoPagamento: this.props.valorTotalDoPagamento,
                dataPagamento: this.props.dataDePagamento,
                desconto: this.props.descontos,
                status: this.props.status,
                empresaId: this.props.empresaId,
                colaboradorId: this.props.colaboradorId,
            }
        });
    };
    get nomeDoColaborador() {
        return this.props.nomeDoColaborador;
    }
    get valorTotalDoPagamento() {
        return this.props.valorTotalDoPagamento;
    }
    get dataDePagamento() {
        return this.props.dataDePagamento;
    }
    get descontos() {
        return this.props.descontos;
    }
    get status() {
        return this.props.status;
    }
    set nomeDoColaborador(value) {
        this.props.nomeDoColaborador = value;
    }
    set valorTotalDoPagamento(value) {
        this.props.valorTotalDoPagamento = value;
    }
    set dataDePagamento(value) {
        this.props.dataDePagamento = value;
    }
    set descontos(value) {
        this.props.descontos = value;
    }
    set status(value) {
        this.props.status = value;
    }
}
exports.PagamentoRepository = PagamentoRepository;
