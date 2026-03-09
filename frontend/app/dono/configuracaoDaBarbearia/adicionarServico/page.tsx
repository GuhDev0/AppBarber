"use client";
import styles from "./styles.module.css";
import { useState, useEffect } from "react";
import { api } from "@/app/lib/api";
import { AxiosError } from "axios";

interface ServicoDto {
  id?: number;
  nome: string;
  tipo: string;
  preco: number;
  comissao: number;
}

export default function AdicionarServico() {
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState("");
  const [preco, setPreco] = useState(0);
  const [comissao, setComissao] = useState(0);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [listaDeServicos, setListaDeServicos] = useState<ServicoDto[]>([]);

  // 🔹 Redireciona se não estiver autenticado
  useEffect(() => {
    listaDeCatalago()
  }, []);


  const listaDeCatalago = async () => {
    try {
      const response = await api.get(`/configuracao/catalago`)
      setListaDeServicos(response.data)
    } catch (error: any) {
      console.log(error.message)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  const novoServico = {
    nome,
    tipo,
    preco,
    comissao
  };

  try {

    const response = await api.post("/configuracao/catalago", novoServico); 
    listaDeCatalago()
  } catch (error: any) {

    console.log("STATUS:", error?.response?.status);
    console.log("ERRO:", error?.response?.data);

  }
}
  // 🔹 Excluir serviço
  async function handleExcluir(id: number) {
    try {
      await api.delete(`/configuracao/deleteServicoCatalago/${id}`)
      listaDeCatalago()
    } catch (error: any) {
      const err = error as AxiosError
      console.log(`Status ${err.response?.status}`)
      console.log(`Error: ${err.message}`)
    }

  }

  return (
    <div className={styles.cabecalho_configuracaoDaBarbearia}>
      <div className={styles.ListaDeServicos}>
        <div className={styles.cabecalho_AdicionarServico}>
          <h3>Serviços</h3>
          <button onClick={() => setMostrarFormulario(true)}>+ Adicionar Serviço</button>
        </div>

        {mostrarFormulario && (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Serviço</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
            <div>
              <label>Tipo</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="">Selecione o tipo</option>
                <option value="Pacote">Pacote</option>
                <option value="Simples">Simples</option>
                <option value="Combo">Combo</option>
              </select>
            </div>
            <div>
              <label>Preço</label>
              <input type="number" value={preco} onChange={(e) => setPreco(Number(e.target.value))} />
            </div>
            <div>
              <label>Comissão</label>
              <input type="number" value={comissao} onChange={(e) => setComissao(Number(e.target.value))} />
            </div>
            <button type="submit">Registrar serviço</button>
            <button type="button" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
          </form>
        )}

        <table>
          <thead>
            <tr>
              <th>Serviço</th>
              <th>Tipo</th>
              <th>Preço</th>
              <th>Comissão</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {listaDeServicos.map((s) => (
              <tr key={s.id}>
                <td>{s.nome}</td>
                <td>{s.tipo}</td>
                <td>R${s.preco}</td>
                <td>{s.comissao}%</td>
                <td>
                  <button onClick={() => handleExcluir(Number(s.id))}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
