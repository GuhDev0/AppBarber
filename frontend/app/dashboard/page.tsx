'use client';
import { useEffect, useState } from "react";
import ClientWrapper from "../components/ClientWrapper";
import CardAnalytics from "../components/cardsAnalytics/cards";
import Carregamento from "../components/carragamento/carregamento";
import GraficoEmBarraEmpilhada from "../components/graficos/barraEmpilhada/grafico";
import { FaMoneyBill1Wave, FaChartLine, FaUsers } from "react-icons/fa6"; 
import styles from "./styles.module.css";

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
   const dataAtual = new Date();
  const requisicao_analycisBarberia = async (token: string) => {
    try {
      const response = await fetch('https://appbarber-analise.onrender.com/analise/barbearia', {
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

const faturamentoMensal = userData?.analise?.faturamento_mensal ?? [];
const rankingMensal = userData?.analise?.atendimento_colaborador_rank ?? [];
const totalServicosMensal = userData?.analise?.total_servicos_barbearia ?? [];
const servicosMaisRealizados = userData?.analise?.servico_mais_realizado_por_mes ?? [];


  const mesAtualConvertido = dataAtual.toISOString().slice(0, 7); 

 const filtraFaturamentoMesAtual = faturamentoMensal.filter(
  (item: any) => item.data ===    mesAtualConvertido
);

  const filtraAtendimentoColaboradorRankMesAtual = rankingMensal.filter((item: any) => item.data === mesAtualConvertido);

  const filtrarTotalDeServicosBarbeariaMesAtual = totalServicosMensal.filter((item: any) =>item.data === mesAtualConvertido);


  const filtraServicoMaisRealizadoMesAtual = servicosMaisRealizados.filter((item: any) => item.data === mesAtualConvertido);
    

const top6ServicosMaisRealizados = filtraServicoMaisRealizadoMesAtual?.slice(0, 6); 

  return (
    <ClientWrapper>
      

      <div className={styles.container}>
        {/* Header com os 3 Cards Principais */}
        <header className={styles.dashboardHeader}>
          <CardAnalytics
            titulo="Ticket Médio"
            valor={userData?.analise?.ticket_medio ? userData?.analise?.ticket_medio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : "R$ 0,00"}
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
            valor={filtrarTotalDeServicosBarbeariaMesAtual?.[0]?.totalDeServicos || 0}
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
                data={top6ServicosMaisRealizados || []}
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
                    {filtraAtendimentoColaboradorRankMesAtual?.map((item: any, index: number) => (
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