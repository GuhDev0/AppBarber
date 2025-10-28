'use client';
import { use, useEffect, useState } from "react";
import styles from "./styles.module.css"
import ClientWrapper from "../components/ClientWrapper";
import { IoAnalyticsSharp } from "react-icons/io5";
import CardAnalytics from "../components/cardsAnalytics/page";
function parseJwt(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [totalDeServicos, setTotalDeServicos ] = useState<number>(0)
  const [receitaDos30D, setReceitaDos30D] = useState<number>(0)


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

  useEffect(()=>{
    async function fetchValorTotal(){
      try{
        const response = await fetch("http://localhost:5000/analise")
        const data = await response.json()
        setTotalDeServicos(data.total_de_servicos);
        setReceitaDos30D(data.receita_30_dias)
        console.log("Valor atualizado:", data.total_de_servicos,data.receita_30_dias);

        
      }catch(error:any){
        console.error('Erro ao buscar valor De Servico',error)
      }
    }
    fetchValorTotal();
  },[]);
  if (loading) return <p>Carregando...</p>;

  return (
    <ClientWrapper>
      <div  className={styles.headerAnalytics}>
        <CardAnalytics
        titulo={"Serviços Realizados"}
        valor={totalDeServicos}
        icon={<IoAnalyticsSharp/>}
        />
        <CardAnalytics
        titulo={"Receita Mensal De Serviços "}
        valor={receitaDos30D.toLocaleString("pt-br",{style:'currency',currency:"BRL"})}
        icon={<IoAnalyticsSharp/>}
        />
        
      </div>
    </ClientWrapper>
  );
}
