import {Analise} from "../repository/analise.js"
import { PagamentoRepository } from "../repository/pagamentoRepository.js"
const analise = new Analise()
const pagamentoRepository = new PagamentoRepository()


pagamentoRepository.gerenciarPagamento(1)

