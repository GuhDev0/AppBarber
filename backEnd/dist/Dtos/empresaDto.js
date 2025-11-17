"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.empresaDto = void 0;
const zod_1 = require("zod");
exports.empresaDto = zod_1.z.object({
    nomeDaEmpresa: zod_1.z.string().min(3, "O nome da empresa deve ter no mínimo 3 caracteres"),
    cnpj: zod_1.z.string().min(14, "CNPJ inválido").max(18, "CNPJ inválido"),
    email: zod_1.z.email("Email inválido"),
    telefone: zod_1.z.string().min(10, "Telefone inválido").max(15, "Telefone inválido"),
    endereco: zod_1.z.string().min(5, "Endereço inválido"),
});
