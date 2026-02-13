'use client';

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import CardAnalytics from "@/app/components/cardsAnalytics/cards";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

type ListaDeAnalise = {
  faturamento_liquido_1_15: number;
  faturamento_liquido_16_fim: number;
  faturamento_total_liquido_mes: number;
  faturamento_por_dia: any[];
};

type ListaDeAnalisePorMesItem = {
  mes: string;
  totalComissao: number;

};

export default function ColaboradorAnalise() {
  const [listaDeAnalise, setListaDeAnalise] = useState<ListaDeAnalise>({
    faturamento_liquido_1_15: 0,
    faturamento_liquido_16_fim: 0,
    faturamento_total_liquido_mes: 0,
    faturamento_por_dia: [],
  });
  const [listaDeAnalisePorMes, setListaDeAnalisePorMes] = useState<ListaDeAnalisePorMesItem[]>([]);
  const { id } = useParams();
  const idNumber = Number(id)

  const buscarListaDeAnalise = async (token: any) => {

    if (!token) {
      throw new Error("Token invalido ou nao encontrado")
    }

    if (isNaN(idNumber)) return;

    try {
      const res = await fetch(`https://appbarber-analise.onrender.com/analise/colaborador/${idNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro na requisição");
      const dados: any[] = await res.json();
      console.log(dados)
      if (dados.length === 0) return;

      const colaborador = dados[0];


      setListaDeAnalise({
          faturamento_liquido_1_15: colaborador.faturamento_liquido_1_15,
          faturamento_liquido_16_fim: colaborador.faturamento_liquido_16_fim,
          faturamento_total_liquido_mes: colaborador.faturamento_total_liquido_mes,
          faturamento_por_dia: colaborador.faturamento_por_dia,
      });


      const totalPorMesArray: ListaDeAnalisePorMesItem[] = Object.entries(colaborador.totalPorMes).map(
        ([mes, totalComissao]) => ({
          mes,
          totalComissao: totalComissao as number,
        })
      );

      setListaDeAnalisePorMes(totalPorMesArray);
    } catch (error: any) {
      console.error("Erro ao buscar lista de análise:", error.message);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
    if (!token) return;

    buscarListaDeAnalise(token);
  }, [id]);

  return (
    <div className={styles.container}>
      <div className={styles.containerCardAnalytics}>
        <CardAnalytics
          titulo="Valor comissão 1D a 15D"
          valor={listaDeAnalise.faturamento_liquido_1_15.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          icon={<FaMoneyBill1Wave color="#ff6b00" />}
          subTitulo=""
        />
        <CardAnalytics
          titulo="Valor comissão 16D a 30D"
          valor={listaDeAnalise.faturamento_liquido_16_fim.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          icon={<FaMoneyBill1Wave color="#ff6b00" />}
          subTitulo=""
        />
        <CardAnalytics
          titulo="Valor Total"
          valor={listaDeAnalise.faturamento_total_liquido_mes.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          icon={<FaMoneyBill1Wave color="#ff6b00" />}
          subTitulo=""
        />
      </div>

      <div className={styles.containerGraficos}>
        <div className={styles.graficoContainer}>
          <div className={styles.graficoTitulo}>
            <h3>Comissão por Mês</h3>
            <p>Receita mensal por comissão</p>
          </div>
        </div>
      </div>
    </div>
  );
}
