'use client';
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import ClientWrapper from "../components/ClientWrapper";
import { IoAnalyticsSharp } from "react-icons/io5";
import CardAnalytics from "../components/cardsAnalytics/page";
import { ResponsiveContainer, Pie, PieChart, Tooltip, Line, LineChart, XAxis, YAxis, Cell, CartesianGrid, Legend } from 'recharts';
import { FaScissors } from "react-icons/fa6";
import Carregamento from "../components/carragamento/page";
import { FaMoneyCheckAlt } from "react-icons/fa"

function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

interface listaDeServico {
  tipoDoServico: string,
  valorDoServico: number,
  data: string,
  hora: string,
}

const listaDeMes = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];
const COLORS = ["#ff6a00", "#edf119ff", "#FF8042", "#A020F0", "#FF1493"];

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [totalDeServicos, setTotalDeServicos] = useState<number>(0);
  const [receitaDos30D, setReceitaDos30D] = useState<number>(0);
  const [servicos, setServicos] = useState<listaDeServico[]>([]);
  const [graficoData, setGraficoData] = useState<{ mes: string; valor: number }[]>([]);
  const [pizzaGrafico, setPizzaGrafico] = useState<{ name: string, value: number }[]>([]);



  useEffect(() => {
    const dadosPorMes = listaDeMes.map((mes, index) => {
      const total = servicos
        .filter((s) => {
          const date = new Date(s.data);
          return !isNaN(date.getTime()) && date.getMonth() === index;
        })
        .reduce((acc, s) => acc + s.valorDoServico, 0);

      return { mes, valor: total };
    });
    setGraficoData(dadosPorMes);
  }, [servicos]);

  useEffect(() => {
    if (Array.isArray(servicos) && servicos.length > 0) {
      const agrupado: Record<string, number> = {};

      servicos.forEach((s) => {
        agrupado[s.tipoDoServico] = (agrupado[s.tipoDoServico] || 0) + 1;
      });

      const data = Object.entries(agrupado).map(([name, value]) => ({
        name,
        value,
      }));

      setPizzaGrafico(data);
    }
  }, [servicos]);


  useEffect(() => {
    const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    const payload = parseJwt(token);
    if (!payload || (payload.exp && Date.now() >= payload.exp * 1000)) {
      localStorage.removeItem('userToken');
      sessionStorage.removeItem('userToken');
      window.location.href = '/login';
      return;
    }
    setUserData(payload);
    setLoading(false);
  }, []);


  useEffect(() => {
    async function fetchValorTotal() {
      try {
        const token = localStorage.getItem('userToken') || sessionStorage.getItem('userToken');
        const response = await fetch("https://gestorappbarber.onrender.com/appBarber/buscarAnaliseEstabelecimento", {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        setTotalDeServicos(data.totalDeServico30D);
        setReceitaDos30D(data.receitaTotal30D);
        setServicos(data.list);
      } catch (error: any) {
        console.error('Erro ao buscar valor de serviço', error);
      }
    }
    fetchValorTotal();
  }, []);

  if (loading) return <Carregamento />;

  return (
    <ClientWrapper>
      <div className={styles.headerAnalytics}>
        <div className={styles.containerCardAnalytics}>
          <CardAnalytics
            titulo={"Total de Serviços"}
            subTitulo={"Serviços realizados este mês"}
            valor={totalDeServicos}
            icon={<FaMoneyCheckAlt color="#ff6b00" />}
          />
          <CardAnalytics
            titulo={"Receita Mensal"}
            subTitulo={"Total de receita neste mês"}
            valor={(receitaDos30D ?? 0).toLocaleString("pt-BR", { style: 'currency', currency: "BRL" })}
            icon={<IoAnalyticsSharp color="#ff6b00" />}
          />

        </div>
      </div>

      <div className={styles.containerGraficos} >
        <div className={`${styles.linha}`}>
          <div className={styles.linha_container_title}>
            <div className={styles.linha_title}>
              <i><IoAnalyticsSharp size={24} /></i>
              <h3>Receita</h3>
            </div>
            <p>Receita mensal por serviços</p>
          </div>

          <ResponsiveContainer width="80%" height={300}>
            <LineChart data={graficoData}>
              <Line type="monotone" dataKey="valor" stroke="#d84b05" />
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip formatter={(value: number) => value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} />
              <Legend />
            </LineChart>
          </ResponsiveContainer>
        </div>


        <div className={`${styles.pizza}`}>
          <div className={styles.pizza_container_title}>
            <div className={styles.container_tilte}>
              <i><FaScissors width={24} height={24} /></i>
              <h3>Serviço</h3>
            </div>
            <p>Distribuição por tipo</p>
          </div>

          <PieChart width={350} height={300}>
            <Pie
              data={pizzaGrafico}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }) => `${name}: ${value}`}
            >
              {pizzaGrafico.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value} serviços`} />
            <Legend />
          </PieChart>
        </div>


      </div>
    </ClientWrapper>
  );
}
