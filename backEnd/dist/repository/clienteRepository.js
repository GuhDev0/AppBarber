"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteRepository = void 0;
const prisma_1 = require("../prisma");
class ClienteRepository {
    // Cria um cliente
    criarCliente = async (clienteDto, empresaId) => {
        return await prisma_1.prisma.cliente.create({
            data: {
                nome: clienteDto.nome,
                sobrenome: clienteDto.Sobrenome,
                email: clienteDto.email,
                telefone: clienteDto.telefone,
                empresaId
            },
            select: {
                id: true,
                nome: true,
                sobrenome: true,
                email: true,
                telefone: true
            }
        });
    };
    // Busca lista de clientes de uma empresa
    buscarListaDeClientes = async (empresaId) => {
        const lista = await prisma_1.prisma.cliente.findMany({
            where: { empresaId },
            select: {
                id: true,
                nome: true,
                sobrenome: true,
                email: true,
                telefone: true,
                servico: {
                    select: { id: true, valorDoServico: true }
                }
            }
        });
        console.log(lista);
        return lista;
    };
    // Deleta cliente pelo ID de forma eficiente
    deleteClientePeloId = async (empresaId, id) => {
        const deletado = await prisma_1.prisma.cliente.deleteMany({
            where: { empresaId, id }
        });
        if (deletado.count === 0) {
            throw new Error("Cliente não encontrado para esta empresa.");
        }
        return { mensagem: "Cliente deletado com sucesso." };
    };
}
exports.ClienteRepository = ClienteRepository;
