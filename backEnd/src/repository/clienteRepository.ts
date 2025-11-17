import type { ClienteDto } from "../Dtos/clienteDto";
import { prisma } from "../prisma";

export class ClienteRepository {
  // Cria um cliente
  criarCliente = async (clienteDto: ClienteDto, empresaId: number) => {
    return await prisma.cliente.create({
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
  buscarListaDeClientes = async (empresaId: number) => {
    const lista  = await prisma.cliente.findMany({
      where: { empresaId },
      select: {
        id: true,
        nome: true,
        sobrenome: true,
        email: true,
        telefone: true,
        servico: {
          select: { id: true,  valorDoServico: true } 
        }
      }
    });
    console.log(lista);
    return lista;
      };

  // Deleta cliente pelo ID de forma eficiente
  deleteClientePeloId = async (empresaId: number, id: number) => {
    const deletado = await prisma.cliente.deleteMany({
      where: { empresaId, id }
    });

    if (deletado.count === 0) {
      throw new Error("Cliente não encontrado para esta empresa.");
    }

    return { mensagem: "Cliente deletado com sucesso." };
  };
}
