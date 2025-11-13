import { prisma } from "../prisma";

type AnaliseColaborador = {
  nomeDoColaborador: string | undefined;
  valorTotal: number;
  valorTotalComissao: number;
  totalDeServicoRealizado: number;
};

export class Analise {
  async analiseCompletaPorColaborador(
    empresaId: number,
    colaboradorId: number
  ): Promise<AnaliseColaborador[]> {
    try {
      const list = await prisma.servico.findMany({
        where: { empresaId, colaboradorId },
        select: {
          id: true,
          valorDoServico: true,
          clienteId: true,
          data: true,
          colaborador: { select: { nomeCompleto: true } },
          servicoConfig: { select: { comissao: true } },
        },
      });

      if (list.length === 0) {
        return [
          {
            nomeDoColaborador: "Sem serviços",
            valorTotal: 0,
            valorTotalComissao: 0,
            totalDeServicoRealizado: 0,
          },
        ];
      }

      const receitaTotal = list.reduce(
        (c: number, s: { valorDoServico: number }) => c + s.valorDoServico,
        0
      );

      const receitaTotalComComissao = list.reduce(
        (c: number, s: { valorDoServico: number; servicoConfig: { comissao: number } }) =>
          c + s.valorDoServico * (s.servicoConfig.comissao / 100),
        0
      );


      const total_de_Servico = list.length;
      const nome = list[0]?.colaborador?.nomeCompleto;

      return [
        {
          nomeDoColaborador: nome,
          valorTotal: receitaTotal,
          valorTotalComissao: receitaTotalComComissao,
          totalDeServicoRealizado: total_de_Servico,
        },
      ];
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erro na análise:", error.message);
      }
      return [];
    }
  }

  analiseCompletaDoEstabelecimento = async (empresaId: number) => {
    try {
      const list = await prisma.servico.findMany({
        where: { empresaId },
        select: {
          id: true,
          valorDoServico: true,
          data: true,
          tipoDoServico: true,
          hora: true,
        }
      })

      function formatDate(days: number) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        date.setHours(0, 0, 0, 0);
        return date;
      }

      const date30days = formatDate(30);
      const listaDoultimos30DSerivcos = list.filter(servico => {
        const servicoDate = new Date(servico.data);
        return servicoDate >= date30days;
      });



      const totalDeServico30D = listaDoultimos30DSerivcos.length;


      const receitaTotal30D = listaDoultimos30DSerivcos.reduce(
        (c: number, s: { valorDoServico: number }) => c + s.valorDoServico,
        0
      );


      const total_de_Servico = list.length;
      console.log("Serviços dos últimos 30 dias:", totalDeServico30D);
      console.log("Total de Serviços:", total_de_Servico);
      console.log("Receita Total:", receitaTotal30D);
      return {
        totalDeServico30D,
        receitaTotal30D,
        total_de_Servico,
        list

      }

    } catch (error: any) {
      console.error("Não foi possivel realizar a analise do estabelecimento", error.message)
      throw new Error(error.message)
    }
  }

}
