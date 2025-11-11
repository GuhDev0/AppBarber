"use client";
import styles from "./styles.module.css";
import { useState, useEffect } from "react";

interface ServicoDto {
  id?: number;
  nome: string; // Corrigido para compatibilidade com o backend
  tipo: string;
  preco: number;
  comissao: number;
}

// 🔹 Helper para resgatar token
function getAuthHeaders() {
  const token =
    localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

  if (!token) {
    console.warn("Token não encontrado. Usuário pode estar deslogado.");
  }

  return {
    Authorization: `Bearer ${token || ""}`,
    "Content-Type": "application/json",
  };
}

// 🔹 Verifica se o usuário está autenticado
function isAuthenticated() {
  return (
    !!localStorage.getItem("userToken") ||
    !!sessionStorage.getItem("userToken")
  );
}

export default function AdicionarServico() {
  const [nome, setNome] = useState(""); // era 'servico'
  const [tipo, setTipo] = useState("");
  const [preco, setPreco] = useState(0);
  const [comissao, setComissao] = useState(0);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [listaDeServicos, setListaDeServicos] = useState<ServicoDto[]>([]);

  // 🔹 Redireciona se não estiver autenticado
  useEffect(() => {
    if (!isAuthenticated()) {
      window.location.href = "/login";
    }
  }, []);

  // 🔹 Buscar lista ao carregar
  useEffect(() => {
    fetch("https://gestorappbarber.onrender.com/appBarber/listDeCatalagoDeServico", {
      headers: getAuthHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.lista) setListaDeServicos(data.lista);
      })
      .catch((err) => console.error("Erro ao buscar serviços:", err));
  }, []);

  // 🔹 Registrar novo serviço
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const novoServico: ServicoDto = { nome, tipo, preco, comissao };

    try {
      const res = await fetch("https://gestorappbarber.onrender.com/appBarber/registraCatalagoService", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(novoServico),
      });

      const result = await res.json();
      console.log("Resposta da API:", result);

      if (res.ok) {
        setListaDeServicos((prev) => [...prev, result.dados]);
        setNome("");
        setTipo("");
        setPreco(0);
        setComissao(0);
        setMostrarFormulario(false);
      } else {
        alert(result.mensagem || "Erro ao registrar serviço");
        console.error("Detalhe do erro:", result.detalhe);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      alert("Erro de conexão com o servidor");
    }
  }

  // 🔹 Excluir serviço
  async function handleExcluir(id?: number) {
    if (!id) return;

    try {
      const res = await fetch(`https://gestorappbarber.onrender.com/appBarber/deletaServico/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        setListaDeServicos((prev) => prev.filter((s) => s.id !== id));
      } else {
        console.error("Erro ao deletar serviço");
      }
    } catch (error) {
      console.error("Erro na exclusão:", error);
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
                <td>R${s.preco.toFixed(2)}</td>
                <td>{s.comissao}%</td>
                <td>
                  <button onClick={() => handleExcluir(s.id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
