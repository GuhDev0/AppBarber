import { ClienteRepository } from "../repository/clienteRepository.js";
import type { ClienteDto } from "../Dtos/clienteDto.js";
const clienteRepositoryDB = new ClienteRepository()

export class ClienteService {
  criarCliente = async (clienteDto: ClienteDto, empresaId: number) => {
    try {
      const criarClienteNoDB = await clienteRepositoryDB.criarCliente(clienteDto, empresaId)
      if (!criarClienteNoDB) throw new Error("Não fazer o cadastro do cliente")
      return criarClienteNoDB
    } catch (error: any) {
      console.error({ menssagem: error.message })
      throw new Error(error.message)
    }
  }
  listaDeCliente = async (empresaId: number) => {
    try {
      
      const lista = await clienteRepositoryDB.buscarListaDeClientes(empresaId)
      if(!empresaId){
        throw new Error("Informe uma Empresa valida !")
      }
      if(!lista){
        throw new Error("Lista não encontrada")
      }
      return lista
    } catch (error: any) {
        throw new Error(error.menssagem)
    }

  }
 deleteCliente = async (empresaId: number, id: number) => {
  const deleteClienteNoDB = await clienteRepositoryDB.deleteClientePeloId(
    empresaId,
    id
  );

  if (!deleteClienteNoDB) {
    throw new Error("Não foi possível deletar o cliente no banco de dados.");
  }

  return deleteClienteNoDB;
};

}