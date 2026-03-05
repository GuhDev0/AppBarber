'use client';

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import CardAnalytics from "@/app/components/cardsAnalytics/cards";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { MoneyFormatado } from "@/app/utils/moneyFormatado/moneyFormatado";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import BarraEmpilhada from "@/app/components/graficos/barraEmpilhada/grafico";




type ListaDeAnalisePorMesItem = {
  mes: string;
  totalComissao: number;

};

export default function ColaboradorAnalise() {
  const [listaDeAnalise, setListaDeAnalise] = useState<any>(null);
  const { id } = useParams();
  const params = useParams();
  const idNumber = Number(params.id);

  const faturamento_liquido_1_15 = listaDeAnalise?.analise?.faturamento_liquido_1_15 ?? 0;
  const faturamento_liquido_16_fim = listaDeAnalise?.analise?.faturamento_liquido_16_fim ?? 0;
  const faturamento_total_liquido_mes = listaDeAnalise?.analise?.faturamento_total_liquido_mes ?? 0;
const faturamento_por_dia = listaDeAnalise?.analise?.faturamento_por_dia ?? [];


const traduzirDiaSemana = (dia: string) => {
  const diasSemana: { [key: string]: string } = {
    "Monday": "Segunda",
    "Tuesday": "Terça",
    "Wednesday": "Quarta",
    "Thursday": "Quinta",
    "Friday": "Sexta",
    "Saturday": "Sábado",
    "Sunday": "Domingo"
  };
  return diasSemana[dia] || dia;
}



  const buscarListaDeAnalise = async (token: string, idNumber: number) => {
    try {
      const res = await fetch(
        `https://appbarber-analise.onrender.com/analise/colaborador/${idNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );



      if (!res.ok) throw new Error("Erro na requisição");

      const dados = await res.json();
      setListaDeAnalise(dados);

    } catch (error: any) {
      console.error("Erro ao buscar análise:", error.message);
    }
  };


  useEffect(() => {


    if (!id) {

      return;
    }

    const token =
      localStorage.getItem("userToken") ||
      sessionStorage.getItem("userToken");

    if (!token) {

      return;
    }

    const idNumber = Number(id);

    if (isNaN(idNumber)) {
      return;
    }

    buscarListaDeAnalise(token, idNumber);
  }, [id]);

  return (
    <div className={styles.containerCardAnalytics}>
      <div className={styles.containerCardAnalytics}>
        <CardAnalytics
          titulo="Valor comissão 1D a 15D"
          valor={MoneyFormatado.formatarValorEM_REAL(faturamento_liquido_1_15)}
          icon={<FaMoneyBill1Wave color="#ff6b00" />}
          subTitulo=""
        />
        <CardAnalytics
          titulo="Valor comissão 16D a 30D"
          valor={MoneyFormatado.formatarValorEM_REAL(faturamento_liquido_16_fim)}
          icon={<FaMoneyBill1Wave color="#ff6b00" />}
          subTitulo=""
        />
        <CardAnalytics
          titulo="Valor Total"
          valor={MoneyFormatado.formatarValorEM_REAL(faturamento_total_liquido_mes)}
          icon={<FaMoneyBill1Wave color="#ff6b00" />}
          subTitulo=""
        />
      </div>

      <div className={styles.containerGraficos}>
        <div className={styles.graficoContainer}>
          <div className={styles.graficoTitulo}>
            <h3> Receita total por dia</h3>
            <p>Receita diaria por comissão</p>
            <div className={styles.chartContainer}>
              <BarraEmpilhada
                data={faturamento_por_dia.map((item: any) => ({
                  ...item,
                  dia_semana: traduzirDiaSemana(item.dia_semana)
                }))}
                name="dia_semana"
                value="valor_liquido"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
