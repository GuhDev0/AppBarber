import type { ClienteDto } from "../Dtos/clienteDto"
import { prisma } from "../prisma";

export class ClienteRepository {
  criarCliente = async (clienteDto: ClienteDto, empresaId: number) => {
    const cliente = await prisma.cliente.create({
      data: {
        nome: clienteDto.nome,
        sobrenome: clienteDto.Sobrenome,
        email: clienteDto.email,
        telefone: clienteDto.telefone,
        empresaId
      }
    })
    return cliente

  }

  buscarListaDeClientes = async (empresaId: number) => {

    const lista = await prisma.cliente.findMany({
      where: {
        empresaId: empresaId
      },include:{
        servico:true
      }
    })
    return lista
  }

 async deleteClientePeloId(empresaId: number, id: number) {
  try {
    const cliente = await prisma.cliente.findFirst({
      where: { empresaId, id: id}
    });

    if (!cliente) {
      throw new Error("Cliente não encontrado para esta empresa.");
    }

    await prisma.cliente.delete({
      where: { id: id}
    });

    return { mensagem: "Cliente deletado com sucesso." };
    
  } catch (error:any) {
    throw new Error(error.message || "Erro ao deletar cliente.");
  }
}

}