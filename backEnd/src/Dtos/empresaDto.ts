import { z } from "zod";


export const empresaDto = z.object({
    nomeDaEmpresa:z.string().min(3, "O nome da empresa deve ter no mínimo 3 caracteres"),
    cnpj:z.string().min(14, "CNPJ inválido").max(18, "CNPJ inválido"),
    email:z.email("Email inválido"),
     telefone: z.string().min(10, "Telefone inválido").max(15, "Telefone inválido"),
    endereco:z.string().min(5, "Endereço inválido"),
})

export type empresaDto = z.infer<typeof empresaDto>;