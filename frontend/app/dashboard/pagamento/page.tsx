"use client";

import styles from "./styles.module.css"
import CardAnalytics from "@/app/components/cardsAnalytics/page"
import { useState, useEffect } from "react";

interface barbeariaAnalytics {
  QuantidadeDeColaboradores: number;
  valorDeServicoTOTAL: number;
 valorTotalDeServicoEmComissao: number;
}

export default function Pagamento() {



  const [barbeariaData, setBarbeariaData] = useState<barbeariaAnalytics>({
    QuantidadeDeColaboradores: 0,
    valorDeServicoTOTAL: 0,
    valorTotalDeServicoEmComissao: 0,
  })

  const buscarAnaliseDePagamento = async () => {
    const token = localStorage.getItem("userToken") || sessionStorage.getItem("userToken")
    if (!token) {
      throw new Error("Token invalido")
    }
    const response = await fetch("http://localhost:3003/appBarber/pagamentoAnalise", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }


    )
    if (!response) {
      throw new Error("Não foi possivel obter resposta do servidor")
    }

    const data = await response.json();
const dadosFormatados: barbeariaAnalytics = {
  QuantidadeDeColaboradores: data.analise[0].Colaboradores,
  valorDeServicoTOTAL: data.analise[0].Receita_TOTAL_DOS_SERVICOS_Barbearia,
  valorTotalDeServicoEmComissao: data.analise[0].Receita_TOTAL_DOS_SERVICOS_EmComissao_Barbearia,
};
setBarbeariaData(dadosFormatados);

  
  }

  useEffect(() => {
    buscarAnaliseDePagamento()
  }, [])

  return (
    <div>
      <h2>
        Pagamentos
      </h2>
      <p>
        Gerencie pagamentos e fechamento de caixa
      </p>
      <div>
        <div>
          <CardAnalytics
            titulo={"Total em comissões"}
            subTitulo={""}
            valor={barbeariaData.valorTotalDeServicoEmComissao.toLocaleString("pt-br",{style:'currency',currency:"BRL"})}
            descricao={"periodo atual(15dias)"}
            icon
          />
        </div>
      </div>
    </div>
  )
}