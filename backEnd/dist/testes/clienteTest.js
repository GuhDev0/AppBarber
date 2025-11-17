"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const clienteRepository_1 = require("../repository/clienteRepository");
const clienteRepo = new clienteRepository_1.ClienteRepository();
clienteRepo.buscarListaDeClientes(1);
