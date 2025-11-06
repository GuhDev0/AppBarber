import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export class ClienteRepository {
    criarCliente = async (clienteDto, empresaId) => {
        const cliente = await prisma.cliente.create({
            data: {
                nome: clienteDto.nome,
                sobrenome: clienteDto.Sobrenome,
                email: clienteDto.email,
                telefone: clienteDto.telefone,
                empresaId
            }
        });
        return cliente;
    };
    buscarListaDeClientes = async (empresaId) => {
        const lista = await prisma.cliente.findMany({
            where: {
                empresaId: empresaId
            }, include: {
                servico: true
            }
        });
        return lista;
    };
    async deleteClientePeloId(empresaId, id) {
        try {
            const cliente = await prisma.cliente.findFirst({
                where: { empresaId, id: id }
            });
            if (!cliente) {
                throw new Error("Cliente não encontrado para esta empresa.");
            }
            await prisma.cliente.delete({
                where: { id: id }
            });
            return { mensagem: "Cliente deletado com sucesso." };
        }
        catch (error) {
            throw new Error(error.message || "Erro ao deletar cliente.");
        }
    }
}
