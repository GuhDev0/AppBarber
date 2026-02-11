import pandas as pd
from Database.connection import get_engine
from datetime import datetime
import numpy as np


def analise_colaborador_service(colaborador_id: int, emprasaId):
    engine = get_engine()
    df_servicoConfig = pd.read_sql(
    '''SELECT * FROM public."ServicoConfig" WHERE "empresaId" = %(empresaId)s''',
    engine,
    params={"empresaId": emprasaId}
)
    
    df_servico = pd.read_sql(
        '''
        SELECT * FROM public."Servico"
        WHERE "empresaId" = %(empresaId)s
        AND "colaboradorId" = %(colaboradorId)s
        ''',
        engine,
        params={
            "empresaId": emprasaId,
            "colaboradorId": colaborador_id
        }
    )
    
    # ✅ TRATAMENTO
    df_servico["data"] = pd.to_datetime(df_servico["data"], errors="coerce")
    df_servico["valor"] = pd.to_numeric(df_servico["valorDoServico"], errors="coerce")

    # ✅ FATURAMENTO MENSAL
    faturamento_mensal_COLABORADOR = (
        df_servico.groupby(df_servico["data"].dt.to_period("M"))["valor"]
        .sum()
        .reset_index()
    )
    
    faturamento_mensal_COLABORADOR["data"] = (
        faturamento_mensal_COLABORADOR["data"]
        .dt.strftime("%Y-%m")
    )

    #  DATAS DINÂMICAS
    hoje = pd.Timestamp.today()

    inicio_mes = hoje.replace(day=1, hour=0, minute=0, second=0)
    dia15 = hoje.replace(day=15, hour=23, minute=59, second=59)
    fim_mes = hoje + pd.offsets.MonthEnd(0)

   
    #valor liquido

    df_agrupado = df_servico.merge(
        df_servicoConfig, left_on="servicoConfigId", right_on="id", how="left")

    
    df_agrupado["valor_liquido"] = np.where(
        df_agrupado["tipoDoServico"] == "PACOTE",
        df_agrupado["valorDoServico"] * (df_agrupado["comissao"] / 100) / 4,
        df_agrupado["valorDoServico"] * (df_agrupado["comissao"] / 100)
    )
     
    #valor liquido 1-15
    df_1_15_liquido = df_agrupado[df_agrupado["data"].between(inicio_mes, dia15)]
    soma_1_15_liquido = df_1_15_liquido["valor_liquido"].sum()
    #valor liquido 16-fim
    df_16_fim_liquido = df_agrupado[df_agrupado["data"].between(
        dia15 + pd.Timedelta(seconds=1),
        fim_mes
    )]
    soma_16_fim_liquido = df_16_fim_liquido["valor_liquido"].sum()
   
    #faturamneto Total liquido
    mesTotal_liquido = soma_1_15_liquido + soma_16_fim_liquido
    
    
    #dia da semana
    df_agrupado["dia_semana"] = df_agrupado["data"].dt.day_name()
    faturamento_por_dia_mes_atual = (
        df_agrupado[df_agrupado["data"].dt.to_period("M") == hoje.to_period("M")]
        .groupby("dia_semana")["valor_liquido"]
        .sum()
        .reset_index()
        .sort_values("valor_liquido", ascending=False)
    )
    
    
    
    
    print("Faturamento líquido de 1 a 15:", soma_1_15_liquido)
    print("Faturamento líquido de 16 ao fim do mês:", soma_16_fim_liquido)
    print("Faturamento líquido total do mês:", mesTotal_liquido)   
    print("Faturamento por dia do mês atual:")
    print(faturamento_por_dia_mes_atual)    
    return {
        "faturamento_liquido_1_15": float(soma_1_15_liquido),
        "faturamento_liquido_16_fim": float(soma_16_fim_liquido),
        "faturamento_total_liquido_mes": float(mesTotal_liquido),
        "faturamento_por_dia": faturamento_por_dia_mes_atual.to_dict(orient="records")
    }

