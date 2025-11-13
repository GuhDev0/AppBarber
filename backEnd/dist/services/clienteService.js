"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteService = void 0;
const clienteRepository_1 = require("../repository/clienteRepository");
const clienteRepositoryDB = new clienteRepository_1.ClienteRepository();
class ClienteService {
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
exports.ClienteService = ClienteService;
