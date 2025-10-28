import { PrismaClient } from "../../generated/prisma/index.js";
import type { catalagoServiceDto } from "../Dtos/catalagoDeService.js";
import { Empresa } from "./EmpresaRepository.js";
const prisma = new PrismaClient()


export class ServicoConfingRepository{
  
   registraServiceCatalago = async (dto:catalagoServiceDto,empresaId:number) => {
    const registra = await prisma.servicoConfig.create({
        data:{
            nome:dto.nome,
            preco:dto.preco,
            tipo:dto.tipo,
            comissao:dto.comissao,
            ativo : true,
            empresa:{
                connect:{id:empresaId}
            }
        }
        
    })
    return registra
   } 
    buscarListaDeServico = async (empresaId:number) =>{
        const list = await prisma.servicoConfig.findMany({
            where:{
                empresaId:empresaId,
                
            }
        })
        if(!list){
            throw new Error("Não possivel encontra a lista")
        }
        return list
    }
    deleteServico = async (empresaId:number, id:number) =>{
        const servico = await prisma.servicoConfig.findFirst(
            {
               where:{
                empresaId:empresaId,
                id:id
               }     
            }
        )

        if(!servico){
            throw new Error("Não possivel encontra este servico")
        }

        return prisma.servicoConfig.delete({
            where:{
                id:id
            }
        })
    }
 }