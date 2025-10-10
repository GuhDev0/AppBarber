// import { PrismaClient } from "../../generated/prisma/index.js";
// import type { ServicoDto } from "../Dtos/servicoDto.js"

// const prisma = new PrismaClient()


// export class AgendamentoBarberRepositry {
//     adicionarServicoNoDb = async (servicoDto: ServicoDto, usuarioId: number) => {
//         const createAgendamento = prisma.servico.create({
//             data: {
//                 tipoDoServico: servicoDto.tipoDoServico,
//                 valorDoServico: servicoDto.valorDoServico,
//                 tempoDoServico: servicoDto.tempoDoServico,
//                 usuario: {
//                     connect: { id: usuarioId }
//                 }
//             }
//         }
//         )
//         return createAgendamento
//     }
// }