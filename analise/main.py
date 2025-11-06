import pandas as pd
import psycopg2
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_connection():
    return psycopg2.connect(
        host="localhost",
        database="appBarberDB",
        user="postgres",
        password="admin"
    )

@app.route("/")
def home():
    return {"mensagem": "API de análise ativa "}

@app.route("/analise")
def analise():
    conn = get_connection()
    query = 'SELECT * FROM public."Servico"'  
    df = pd.read_sql(query, conn)
    conn.close()

    valor_total = df["valorDoServico"].sum()
    valor_total_por_id = df.groupby("id")["valorDoServico"].sum()  # corrigido

    total_de_servicos = len(df)
    df['data'] = pd.to_datetime(df['data'])
    receita_30dias = df[df['data'] >= pd.Timestamp.today() - pd.Timedelta(days=30)]

    analise = {
        "valor_total": float(valor_total),
        "total_de_servicos": total_de_servicos,
        "receita_30_dias": float(receita_30dias["valorDoServico"].sum())
    }

    return jsonify(analise)

if __name__ == "__main__":
    app.run(port=5000, debug=True)
