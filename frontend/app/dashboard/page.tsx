
'use client';
import { useEffect, useState } from "react";
import ClientWrapper from "../components/ClientWrapper";
import CardAnalytics from "../components/cardsAnalytics/page";
import Carregamento from "../components/carragamento/page";
import GraficoEmBarraEmpilhada from "../components/graficos/barraEmpilhada/page";
import { FaMoneyBill1Wave, FaChartLine, FaUsers } from "react-icons/fa6"; 
import styles from "./styles.module.css";

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const requisicao_analycisBarberia = async (token: string) => {
    try {
      const response = await fetch('https://appbarber-api-analise.onrender.com/analise/barbearia', {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Erro ao buscar dados");

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token =
      localStorage.getItem('userToken') ||
      sessionStorage.getItem('userToken');

    if (!token) {
      setLoading(false);
      return;
    }

    requisicao_analycisBarberia(token);
  }, []);


  if (loading) return <Carregamento />;

  const filtraFaturamentoMesAtual = userData?.analise?.faturamento_mensal.filter((item: any) => {
    const dataFaturamento = new Date(item.data);
    const dataAtual = new Date();
    return (dataFaturamento.getMonth() === dataAtual.getMonth() && dataFaturamento.getFullYear() === dataAtual.getFullYear());
  });

  const filtraAtendimentoColaboradorRankMesAtual = userData?.analise?.atendimento_colaborador_rank.filter((item: any) => {
    const dataAtendimento = new Date(item.data);
    const dataAtual = new Date();
    return (dataAtendimento.getMonth() === dataAtual.getMonth() && dataAtendimento.getFullYear() === dataAtual.getFullYear());
  });

  const filtrarTotalDeServicosBarbeariaMesAtual = userData?.analise?.total_servicos_barbearia.filter((item: any) => {
    const dataServico = new Date(item.data);
    const dataAtual = new Date();
    return (dataServico.getMonth() === dataAtual.getMonth() && dataServico.getFullYear() === dataAtual.getFullYear());
  });


  const filtraServicoMaisRealizadoMesAtual = userData?.analise?.servico_mais_realizado_por_mes.filter((item: any) => {
    const dataServico = new Date(item.data);
    const dataAtual = new Date();

    return (dataServico.getMonth() === dataAtual.getMonth() && dataServico.getFullYear() === dataAtual.getFullYear());
  });
    

  const top6ServicosMaisRealizados = filtraServicoMaisRealizadoMesAtual?.slice(0, 6); 

  return (
    <ClientWrapper>
      <div className={styles.container}>
        {/* Header com os 3 Cards Principais */}
        <header className={styles.dashboardHeader}>
          <CardAnalytics
            titulo="Ticket Médio"
            valor={userData?.analise?.ticket_medio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            icon={<FaChartLine size={20} color="#ff6a00" />}
            subTitulo=""
          />
          <CardAnalytics
            titulo="Faturamento Mensal"
            valor={filtraFaturamentoMesAtual?.[0]?.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) || "R$ 0,00"}
            icon={<FaMoneyBill1Wave size={20} color="#ff6a00" />}
            subTitulo=""
          />
          <CardAnalytics
            titulo="Total de Serviços"
            valor={userData?.analise?.filtrarTotalDeServicosBarbeariaMesAtual?.[0]?.totalDeServicos || 0}
            icon={<FaUsers size={20} color="#ff6a00" />}
            subTitulo=""
          />
        </header>

        {/* Grid Principal: Gráfico e Ranking */}
        <main className={styles.dashboardGrid}>
          <section className={styles.chartSection}>
            <h2 className={styles.sectionTitle}>Serviços Mais Realizados</h2>
            <div className={styles.chartContainer}>
             
              <GraficoEmBarraEmpilhada
                data={top6ServicosMaisRealizados}
                name="tipoDoServico"
                value="quantidade"
                
              />
            </div>
          </section>

          <section className={styles.rankingSection}>
            <div className={styles.rankingHeader}>
              <h2 className={styles.sectionTitle}>Ranking de Atendimento</h2>
            </div>

            <div className={styles.rankingTableWrapper}>
              <div className={styles.rankingTableWrapper}>
                <table className={styles.rankingTable}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>COLABORADOR</th>
                      <th style={{ textAlign: 'right' }}>ATENDIMENTOS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtraAtendimentoColaboradorRankMesAtual.map((item: any, index: number) => (
                      <tr key={index}>
                        <td>
                          <span className={`${styles.rankBadge} ${styles[`rank${index + 1}`]}`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className={styles.colaboradorName}>{item.nomeCompleto}</td>
                        <td className={styles.totalAtendimentos}>{item.totalDeAtendimento}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>



          </section>
        </main>
      </div>
    </ClientWrapper>
  );
}