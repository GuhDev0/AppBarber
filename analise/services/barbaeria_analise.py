import pandas as pd
import math
from Database.connection import get_engine
import numpy as np

def limpar_nan(obj):
    if isinstance(obj, dict):
        return {k: limpar_nan(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [limpar_nan(i) for i in obj]
    if isinstance(obj, float) and math.isnan(obj):
        return 0
    return obj


def analise_barbearia(empresaId):
    engine = get_engine()

    # CONSULTAS SEGURAS (SEM INTERPOLAÇÃO DIRETA)
    query_services = """
        SELECT * FROM public."Servico"
        WHERE "empresaId" = %(empresaId)s
    """

    query_colaboradores = """
        SELECT * FROM public."Colaborador"
        WHERE "empresaId" = %(empresaId)s
    """


    df_servicoConfig = pd.read_sql(
    '''SELECT * FROM public."ServicoConfig" WHERE "empresaId" = %(empresaId)s''',
    engine, params={"empresaId": empresaId}
    
    
)

    df_servico = pd.read_sql(query_services, engine, params={"empresaId": empresaId})
    df_colaboradores = pd.read_sql(query_colaboradores, engine, params={"empresaId": empresaId})


     #  DATAS DINÂMICAS
    hoje = pd.Timestamp.today()

    inicio_mes = hoje.replace(day=1, hour=0, minute=0, second=0)
    dia15 = hoje.replace(day=15, hour=23, minute=59, second=59)
    fim_mes = (hoje + pd.offsets.MonthEnd(0)).replace(hour=23, minute=59, second=59)

   
    if df_servico.empty:
        return {
            "faturamento_mensal": [],
            "servico_mais_realizado_por_mes": [],
            "movimento_dia": [],
            "servicos_faturamento": [],
            "ticket_medio": 0,
            "atendimento_colaborador_rank": [],
            "total_servicos_barbearia": []
        }

    # TRATAMENTO
    df_servico["data"] = pd.to_datetime(df_servico["data"], errors="coerce")
    df_servico["valor"] = pd.to_numeric(df_servico["valorDoServico"], errors="coerce")

    df_servico = df_servico.fillna(0)

    # =========================
    # FATURAMENTO MENSAL
    # =========================
    faturamento_mensal = (
        df_servico.groupby(df_servico["data"].dt.to_period("M"))["valor"]
        .sum()
        .reset_index()
    )
    faturamento_mensal["data"] = faturamento_mensal["data"].dt.strftime("%Y-%m")

    # =========================
    # SERVIÇO MAIS REALIZADO POR MÊS
    # =========================
    servico_mais_realizado_por_mes = (
        df_servico.groupby([df_servico["data"].dt.to_period("M"), "tipoDoServico"])
        .size()
        .reset_index(name="quantidade")
        .sort_values(["data", "quantidade"], ascending=[True, False])
    )
    servico_mais_realizado_por_mes["data"] = (
        servico_mais_realizado_por_mes["data"].dt.strftime("%Y-%m")
    )

    # =========================
    # MOVIMENTO POR DIA DA SEMANA
    # =========================
    df_servico["dia_semana"] = df_servico["data"].dt.day_name()

    movimento_dia = (
        df_servico.groupby("dia_semana")["valor"]
        .sum()
        .reset_index()
        .sort_values("valor", ascending=False)
    )

    # =========================
    # FATURAMENTO POR SERVIÇO
    # =========================
    servicos_faturamento = (
        df_servico.groupby("tipoDoServico")["valor"]
        .sum()
        .reset_index()
        .sort_values("valor", ascending=False)
    )
   
    df_agrupado = df_servico.merge(
    df_servicoConfig,
    left_on="servicoConfigId",
    right_on="id",
    how="left"
        )   
    
    df_agrupado["valor_liquido"] = np.where(
        df_agrupado["tipoDoServico"] == "Pacote",
        df_agrupado["valor"] * 0.5 / 4,
        df_agrupado["valor"] * 0.6  
         
    )
    
    
    valorLiquido30D = df_agrupado[df_agrupado["data"].between(inicio_mes, fim_mes)]
    somaValorLiquido30D = valorLiquido30D["valor_liquido"].sum()
    
    
    
    # =========================
    # TICKET MÉDIO
    # =========================
    ticket_medio_por_mes = (
        df_servico.groupby(df_servico["data"].dt.to_period("M"))["valor"]
        .mean()
        .mean()
    )

    ticket_medio_por_mes = float(ticket_medio_por_mes) if pd.notna(ticket_medio_por_mes) else 0.0

    # =========================
    # RANK DE ATENDIMENTO POR COLABORADOR
    # =========================
    atendimento_colaborador_rank = (
        df_servico.groupby(["colaboradorId", df_servico["data"].dt.to_period("M")])
        .size()
        .reset_index(name="totalDeAtendimento")
        .sort_values("totalDeAtendimento", ascending=False)
    )

    atendimento_colaborador_rank["data"] = (
        atendimento_colaborador_rank["data"].dt.strftime("%Y-%m")
    )

    rank_por_nome = atendimento_colaborador_rank.merge(
        df_colaboradores[["id", "nomeCompleto"]],
        left_on="colaboradorId",
        right_on="id",
        how="left"
    )

    rank_por_nome = rank_por_nome[["nomeCompleto", "totalDeAtendimento", "data"]]

    # =========================
    # TOTAL DE SERVIÇOS POR MÊS
    # =========================
    total_servicos_barbearia = (
        df_servico["tipoDoServico"]
        .groupby(df_servico["data"].dt.to_period("M"))
        .count()
        .reset_index(name="totalDeServicos")
    )

    total_servicos_barbearia["data"] = (
        total_servicos_barbearia["data"].dt.strftime("%Y-%m")
    )

    resultado = {
        "faturamento_mensal": faturamento_mensal.to_dict(orient="records"),
        "faturamento_mensal_liquido": somaValorLiquido30D,
        "servico_mais_realizado_por_mes": servico_mais_realizado_por_mes.to_dict(orient="records"),
        "movimento_dia": movimento_dia.to_dict(orient="records"),
        "servicos_faturamento": servicos_faturamento.to_dict(orient="records"),
        "ticket_medio": ticket_medio_por_mes,
        "atendimento_colaborador_rank": rank_por_nome.to_dict(orient="records"),
        "total_servicos_barbearia": total_servicos_barbearia.to_dict(orient="records")
    }

    return limpar_nan(resultado)