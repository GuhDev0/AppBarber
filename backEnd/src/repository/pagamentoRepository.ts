import { PrismaClient } from "../../generated/prisma/index.js";

const prisma = new PrismaClient()


export class PagamentoRepository{
  gerenciarPagamento= async (empresaId:number) =>{
    const list = await prisma.servico.findMany({
      where:{
        empresaId:empresaId
      },select:{
        valorDoServico:true,
        servicoConfig:{
          select:{
            comissao:true
          }

        },colaborador:{
          select:{
            nomeCompleto:true  
          }
        }
      }
    })
      
      const receitaTotalDosServiço = list.reduce((acc, s) => acc + s.valorDoServico ,0 )
      const receitaTotalDescontadoComissao = list.reduce((acc, s ) => acc + s.valorDoServico * ( s.servicoConfig.comissao / 100),0)
      const resultado = [
      {
      
        Receita_TOTAL_DOS_SERVICOS_Barbearia:receitaTotalDosServiço,
        Receita_TOTAL_DOS_SERVICOS_EmComissao_Barbearia:receitaTotalDescontadoComissao
      }
    ]
    return console.log(resultado) 
  }

  

}