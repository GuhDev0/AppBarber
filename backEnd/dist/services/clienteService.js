import { ClienteRepository } from "../repository/clienteRepository.js";
const clienteRepositoryDB = new ClienteRepository();
export class ClienteService {
    criarCliente = async (clienteDto, empresaId) => {
        try {
            const criarClienteNoDB = await clienteRepositoryDB.criarCliente(clienteDto, empresaId);
            if (!criarClienteNoDB)
                throw new Error("Não fazer o cadastro do cliente");
            return criarClienteNoDB;
        }
        catch (error) {
            console.error({ menssagem: error.message });
            throw new Error(error.message);
        }
    };
    listaDeCliente = async (empresaId) => {
        try {
            const lista = await clienteRepositoryDB.buscarListaDeClientes(empresaId);
            if (!empresaId) {
                throw new Error("Informe uma Empresa valida !");
            }
            if (!lista) {
                throw new Error("Lista não encontrada");
            }
            return lista;
        }
        catch (error) {
            throw new Error(error.menssagem);
        }
    };
    deleteCliente = async (empresaId, id) => {
        const deleteClienteNoDB = await clienteRepositoryDB.deleteClientePeloId(empresaId, id);
        if (!deleteClienteNoDB) {
            throw new Error("Não foi possível deletar o cliente no banco de dados.");
        }
        return deleteClienteNoDB;
    };
}
//# sourceMappingURL=clienteService.js.map