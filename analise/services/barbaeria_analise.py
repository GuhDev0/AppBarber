import pandas as pd
from Database.connection import get_engine

def analise_barbearia(empresaId: int):
    engine = get_engine()

    query_services = f'SELECT * FROM public."Servico" WHERE "empresaId" = {empresaId}'
    query_colaboradores = f'SELECT * FROM public."Colaborador" WHERE "empresaId" = {empresaId}'
    df_servico = pd.read_sql(query_services, engine,params={"empresaId": empresaId})
    df_colaboradores = pd.read_sql(query_colaboradores, engine,params={"empresaId": empresaId})

    # TRATAMENTO
    df_servico["data"] = pd.to_datetime(df_servico["data"], errors="coerce")
    df_servico["valor"] = pd.to_numeric(df_servico["valorDoServico"], errors="coerce")

    # FATURAMENTO MENSAL
    faturamento_mensal = (
        df_servico.groupby(df_servico["data"].dt.to_period("M"))["valor"]
        .sum()
        .reset_index()
    )   
    faturamento_mensal["data"] = faturamento_mensal["data"].dt.strftime("%Y-%m")


    # SERVIÇOS MAIS REALIZADOS
    servico_volume = (
        df_servico.groupby("tipoDoServico")
        .size()
        .reset_index(name="quantidade")
        .sort_values("quantidade", ascending=False)
    )
    
    
    #Serviços Mais por mes
    servico_mais_realizado_por_mes = (
        df_servico.groupby([df_servico["data"].dt.to_period("M"), "tipoDoServico"])
        .size()
        .reset_index(name="quantidade")
        .sort_values(["data", "quantidade"], ascending=[True, False])
    )
    servico_mais_realizado_por_mes["data"] = servico_mais_realizado_por_mes["data"].dt.strftime("%Y-%m")
    
    

    # MOVIMENTO POR DIA DA SEMANA 
    df_servico["dia_semana"] = df_servico["data"].dt.day_name()

    movimento_dia = (
        df_servico.groupby("dia_semana")["valor"]
        .sum()
        .reset_index()
        .sort_values("valor", ascending=False)
    )

    # FATURAMENTO POR SERVIÇO
    servicos_faturamento = (
        df_servico.groupby("tipoDoServico")["valor"]
        .sum()
        .reset_index()
        .sort_values("valor", ascending=False)
    )

    # TICKET MÉDIO por mes
    ticket_medio_por_mes = df_servico.groupby(df_servico["data"].dt.to_period("M"))["valor"].mean().mean()
    #Rankeamento de total de atendimento por colaborador por mes
    atendimento_colabodorador_rank = (
        df_servico.groupby(["colaboradorId", df_servico["data"].dt.to_period("M")])
        .size()
        .reset_index(name="totalDeAtendimento")
        .sort_values(["totalDeAtendimento"], ascending=False)
    )
    atendimento_colabodorador_rank["data"] = atendimento_colabodorador_rank["data"].dt.strftime("%Y-%m")

    rank_por_nome = atendimento_colabodorador_rank.merge(df_colaboradores[["id", "nomeCompleto"]], left_on="colaboradorId", right_on="id", how="left")
    rank_por_nome = rank_por_nome[["nomeCompleto", "totalDeAtendimento","data"]]
    

    #total de atendimento por mes
    total_servicos_barbearia = df_servico["tipoDoServico"].groupby(df_servico["data"].dt.to_period("M")).count().reset_index(name="totalDeServicos")
    total_servicos_barbearia["data"] = total_servicos_barbearia["data"].dt.strftime("%Y-%m")
   
    return {
        
        "faturamento_mensal": faturamento_mensal.to_dict(orient="records"),
        "servico_mais_realizado_por_mes": servico_mais_realizado_por_mes.to_dict(orient="records"),
        "movimento_dia": movimento_dia.to_dict(orient="records"),
        "servicos_faturamento": servicos_faturamento.to_dict(orient="records"),
        "ticket_medio": ticket_medio_por_mes,
        "atendimento_colaborador_rank": rank_por_nome.to_dict(orient="records"),
        "total_servicos_barbearia": total_servicos_barbearia.to_dict(orient="records")
    }
