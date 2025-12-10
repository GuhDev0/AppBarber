'use client';

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import CardAnalytics from "@/app/components/cardsAnalytics/page";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

type ListaDeAnalise = {
  valorTotal: number;
  valorTotalComissao: number;
  valorTotal1a15: number;
  valorTotalComissao1a15: number;
  valorTotal16a30: number;
  valorTotalComissao16a30: number;
};

type ListaDeAnalisePorMesItem = {
  mes: string;
  totalComissao: number;
};

export default function ColaboradorAnalise() {
  const [listaDeAnalise, setListaDeAnalise] = useState<ListaDeAnalise>({
    valorTotal: 0,
    valorTotalComissao: 0,
    valorTotal1a15: 0,
    valorTotalComissao1a15: 0,
    valorTotal16a30: 0,
    valorTotalComissao16a30: 0,
  });
  const [listaDeAnalisePorMes, setListaDeAnalisePorMes] = useState<ListaDeAnalisePorMesItem[]>([]);
  const { id } = useParams();
  const idNumber = Number(id)
  
  const buscarListaDeAnalise = async (token:any) => {

    if (!token) {
      throw new Error("Token invalido ou nao encontrado")
    }

    if (isNaN(idNumber)) return;

    try {
      const res = await fetch(`https://gestorappbarber.onrender.com/appBarber/buscarAnalisePorColaborador/${idNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erro na requisição");
      const dados: any[] = await res.json();
      console.log(dados)
      if (dados.length === 0) return;

      const colaborador = dados[0];


      setListaDeAnalise({
        valorTotal: colaborador.valorTotal,
        valorTotalComissao: colaborador.valorTotalComissao,
        valorTotal1a15: colaborador.valorTotal1a15,
        valorTotalComissao1a15: colaborador.valorTotalComissao1a15,
        valorTotal16a30: colaborador.valorTotal16a30,
        valorTotalComissao16a30: colaborador.valorTotalComissao16a30,
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
          valor={listaDeAnalise.valorTotalComissao1a15.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          icon={<FaMoneyBill1Wave color="#ff6b00" />}
          subTitulo=""
        />
        <CardAnalytics
          titulo="Valor comissão 16D a 30D"
          valor={listaDeAnalise.valorTotalComissao16a30.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
          icon={<FaMoneyBill1Wave color="#ff6b00" />}
          subTitulo=""
        />
        <CardAnalytics
          titulo="Valor Total"
          valor={listaDeAnalise.valorTotalComissao.toLocaleString("pt-BR", {
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
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={listaDeAnalisePorMes}>
              <XAxis dataKey="mes" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                formatter={(value: number) =>
                  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                }
              />
              <Legend />
              <Bar dataKey="totalComissao" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
