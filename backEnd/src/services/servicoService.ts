import { ServicoRepository } from "../repository/servicoRepository.js"
import type { ServicoDto } from "../Dtos/servicoDto.js"
const servico = new ServicoRepository()


export class ServicoService{
    createService =async (servicoDto:ServicoDto) =>{
        const service = await servico.createServico(servicoDto,1,5)
        return service
    }
}