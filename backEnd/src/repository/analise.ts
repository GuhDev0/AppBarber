import { number } from "zod";
import { prisma } from "../prisma";

type AnaliseColaborador = {
  nomeDoColaborador: string | undefined;
  valorTotal: number;
  valorTotalComissao: number;
  totalDeServicoRealizado: number;
  quantidadeServico1a15: number;
  valorTotalComissao1a15: number;
  totalDeServico1a15: number;
  quantidadeServico16a30: number;
  valorTotalComissao16a30: number;
  totalDeServico16a30: number;
  totalPorMes: { [mes: string]: number };
};

export class Analise {
  async analiseCompletaPorColaborador(empresaId: number, colaboradorId: number): Promise<AnaliseColaborador[]> {
    try {
      const list = await prisma.servico.findMany({
        where: { empresaId, colaboradorId },
        select: {
          id: true,
          valorDoServico: true,
          data: true,
          colaborador: { select: { nomeCompleto: true } },
          servicoConfig: { select: { comissao: true, tipo: true } },
        },
      });
      const totalPorMes: { [mes: string]: number } = {};

      list.forEach((s) => {
        const data = new Date(s.data);
        const mes = `${data.getFullYear()}-${data.getMonth() + 1}`;

        if (!totalPorMes[mes]) {
          totalPorMes[mes] = 0;
        }

        let comissao = 0;

        if (s.servicoConfig.tipo === "Pacote") {
          comissao = (s.valorDoServico / 2) / 4;
        } else {
          comissao = s.valorDoServico * (s.servicoConfig.comissao / 100);
        }

        totalPorMes[mes] += comissao;
      });

      const lista1a15 = list.filter(s => {
        const dia = new Date(s.data).getDate();
        return dia >= 1 && dia <= 15;
      });
      const lista16a30 = list.filter(s => {
        const dia = new Date(s.data).getDate();
        return dia >= 16; // até o fim do mês
      });



      // --- Geral ---
      const receitaTotal = list.reduce((c, s) => c + s.valorDoServico, 0);
      const total_de_Servico = list.length;

      // --- Do dia 1 ao 15 ---

      const valorPacotes1a15 = lista1a15.reduce((c, s) => {
        if (s.servicoConfig.tipo !== "Pacote") return c;
        const parcela = (s.valorDoServico / 2) / 4;
        return c + parcela;
      }, 0);

      const valorNormal1a15 = lista1a15.reduce((c, s) => {
        if (s.servicoConfig.tipo === "Pacote") return c;
        return c + s.valorDoServico;
      }, 0);

      const valorTotalComissao1a15 = lista1a15.reduce((c, s) => {
        if (s.servicoConfig.tipo === "Pacote") {
          const parcela = (s.valorDoServico / 2) / 4;
          return c + parcela;
        }
        return c + (s.valorDoServico * (s.servicoConfig.comissao / 100));
      }, 0);



      // --- Do dia 16 ao 30/31 ---

      const valorPacotes16a30 = lista16a30.reduce((c, s) => {
        if (s.servicoConfig.tipo !== "Pacote") return c;
        const parcela = (s.valorDoServico / 2) / 4;
        return c + parcela;
      }, 0);
      const valorNormal16a30 = lista16a30.reduce((c, s) => {
        if (s.servicoConfig.tipo === "Pacote") return c;
        return c + s.valorDoServico;
      }, 0);

      const valorTotalComissao16a30 = lista16a30.reduce((c, s) => {
        if (s.servicoConfig.tipo === "Pacote") {
          const parcela = (s.valorDoServico / 2) / 4;
          return c + parcela;
        }
        return c + (s.valorDoServico * (s.servicoConfig.comissao / 100));
      }, 0);



      const valorTotalComissao30D = valorTotalComissao1a15 + valorTotalComissao16a30
      const nome = list[0]?.colaborador?.nomeCompleto;
      const totalDeServico1a15 = lista1a15.length;
      const totalDeServico16a30 = lista16a30.length;


      return [{
        nomeDoColaborador: nome,
        valorTotal: receitaTotal,
        valorTotalComissao: valorTotalComissao30D,
        totalDeServicoRealizado: total_de_Servico,
        quantidadeServico1a15: totalDeServico1a15,
        valorTotalComissao1a15,
        totalDeServico1a15,
        quantidadeServico16a30: totalDeServico16a30,
        valorTotalComissao16a30,
        totalDeServico16a30,
        totalPorMes,
      }];

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
