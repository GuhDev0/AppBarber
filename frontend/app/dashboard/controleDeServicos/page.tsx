"use client";

import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import CardAnalytics from "@/app/components/cardsAnalytics/page";

interface Service {
  id?: number;
  tipoDoServico: string;
  valorDoServico: number;
  colaboradorId: number;
  data: string;
  hora: string;
  colaborador?: {
    id: number;
    nomeCompleto: string;
  };
  servicoConfigId: number;
  clienteId: number;
}

interface Colaborador {
  id: number;
  nomeCompleto: string;
  totalServicos?: number;
}
interface ListaDeServico {
  id: number;
  nome: string;
  tipo: "Simples" | "Pacote";
  preco: number;
}
interface listaDeClientes {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  tel: string;
}
function formatDateForInput(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatTimeForInput(date: Date) {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}


export default function ControleDeServicos() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [servicos, setServicos] = useState<Service[]>([]);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [catalagoDeSERVICOS, setCatalagoDeSERVICOS] = useState<ListaDeServico[]>([]);
  const [listaDeClientes, setListaDeClientes] = useState<listaDeClientes[]>([])
  const now = new Date();
  const [formData, setFormData] = useState<Service>({
    tipoDoServico: "",
    valorDoServico: 0,
    colaboradorId: 0,
    data: formatDateForInput(now),
    hora: formatTimeForInput(now),
    servicoConfigId: 0,
    clienteId: 0
  });

  const [filtroServico, setFiltroServico] = useState("");
  const [filtroColaborador, setFiltroColaborador] = useState("");
  const [filtroData, setFiltroData] = useState("");

  const URL_SAVE = "https://gestorappbarber.onrender.com/appBarber/serviceSave";
  const URL_LIST = "https://gestorappbarber.onrender.com/appBarber/findListServices";
  const URL_COLABS = "https://gestorappbarber.onrender.com/appBarber/listColaboradores";
  const URL_listDeServico = "https://gestorappbarber.onrender.com/appBarber/listDeCatalagoDeServico";

  // Função para buscar token e garantir que é string
  const getToken = (): string | null => {
    return localStorage.getItem("userToken") || sessionStorage.getItem("userToken");
  };

  // Buscar serviços
  const fetchServices = async (token?: string) => {
    const validToken: string | null = token || getToken();
    if (!validToken) return;

    try {
      const response = await fetch(URL_LIST, {
        headers: { Authorization: `Bearer ${validToken}` },
      });
      if (response.ok) {
        const data = await response.json();
        setServicos(Array.isArray(data.services) ? data.services : []);
      } else {
        console.error("Erro ao listar serviços:", response.status);
      }
    } catch (error: any) {
      console.error("Erro ao buscar serviços:", error.message);
    }
  };

  // Buscar colaboradores
  const fetchColaboradores = async (token?: string) => {
    const validToken = token || getToken();
    if (!validToken) return;

    try {
      const response = await fetch(URL_COLABS, {
        headers: { Authorization: `Bearer ${validToken}` },
      });
      if (!response.ok) throw new Error("Erro ao buscar colaboradores");
      const data = await response.json();
      setColaboradores(Array.isArray(data.list) ? data.list : Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Erro ao buscar colaboradores:", error.message);
    }
  };

  // Buscar catálogo de serviços
  const fetchCatalagoDeServicos = async (token?: string) => {
    const validToken = token || getToken();
    if (!validToken) {
      console.warn("fetchCatalagoDeServicos: token não encontrado");
      return;
    }

    try {
      const response = await fetch(URL_listDeServico, {
        headers: { Authorization: `Bearer ${validToken}`, "Content-Type": "application/json" },
      });

      console.log("[catálogo] status:", response.status, response.statusText);

      // tenta ler JSON; se falhar, loga o texto
      let data: any = null;
      try {
        data = await response.json();
      } catch (jsonErr) {
        const text = await response.text().catch(() => "");
        console.error("[catálogo] resposta não-JSON:", text);
        throw new Error("Resposta do servidor não é JSON");
      }

      console.log("[catálogo] body:", data);


      const lista =
        Array.isArray(data.lista) ? data.lista
          : Array.isArray(data.Lista) ? data.Lista
            : Array.isArray(data.services) ? data.services
              : Array.isArray(data) ? data
                : Array.isArray(data.data) ? data.data
                  : [];

      if (!lista.length) {
        console.warn("[catálogo] lista vazia ou formato inesperado. Chaves do body:", Object.keys(data || {}));
      }

      setCatalagoDeSERVICOS(lista);
    } catch (error: any) {
      console.error("[catálogo] erro ao buscar catálogo:", error?.message || error);
    }
  };


  // Inicialização
  useEffect(() => {
    const token = getToken();
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetchServices(token);
    fetchColaboradores(token);
    fetchCatalagoDeServicos(token);
    findListCustomer();
  }, []);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;


    if (name === "servicoConfigId") {
      const id = Number(value);
      const servicoSelecionado = catalagoDeSERVICOS.find((s) => s.id === id);
      setFormData((prev) => ({
        ...prev,
        servicoConfigId: id,
        tipoDoServico: servicoSelecionado?.nome || "",
        valorDoServico: servicoSelecionado?.preco || 0,

      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "valorDoServico" ||
          name === "colaboradorId" ||
          name === "clienteId"
          ? Number(value)
          : value,
    }));

  };

  // Envia serviço
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return alert("Usuário não autenticado!");

    // validações básicas
    if (!formData.servicoConfigId) return alert("Selecione um serviço do catálogo.");
    if (!formData.colaboradorId) return alert("Selecione um colaborador.");
    if (!formData.data || !formData.hora) return alert("Preencha data e hora.");

    try {
      const response = await fetch(URL_SAVE, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const newService = await response.json();
        setServicos((prev) => [...prev, newService]);
        const now = new Date();
        setFormData({
          tipoDoServico: "",
          valorDoServico: 0,
          colaboradorId: 0,
          data: formatDateForInput(now),
          hora: formatTimeForInput(now),
          servicoConfigId: 0,
          clienteId: 0,
        });

        setMostrarFormulario(false);
      } else {
        console.log(formData)

        const errorData = await response.json().catch(() => ({}));

        alert(errorData.message || "Erro ao registrar serviço");

      }
    } catch (error: any) {
      console.error("Erro ao salvar serviço:", error.message);
      alert("Erro de conexão ao salvar serviço.",);

    }
  };

  // Deletar serviço
  const deleteService = async (id?: number) => {
    if (!id) return;
    const token = getToken();
    if (!token) return alert("Usuário não autenticado!");

    try {
      const response = await fetch(`http://localhost:3003/appBarber/deleteService/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) setServicos((prev) => prev.filter((s) => s.id !== id));
      else {
        const errorData = await response.json().catch(() => ({}));
        alert("Erro ao deletar serviço: " + (errorData.message || "Erro desconhecido"));
      }
    } catch (error: any) {
      console.error("Erro ao deletar serviço:", error.message);
    }
  };

  // Filtragem
  const servicosFiltrados = servicos.filter((s) => {
    const tipoOk = s.tipoDoServico.toLowerCase().includes(filtroServico.toLowerCase());
    const colaboradorOk = s.colaborador?.nomeCompleto.toLowerCase().includes(filtroColaborador.toLowerCase()) ?? false;
    const dataOk = filtroData ? s.data.startsWith(filtroData) : true;
    return tipoOk && colaboradorOk && dataOk;
  });

  // Buscar  lista de Clientes 
  const findListCustomer = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch("http://localhost:3003/appBarber/listaDeClientes", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const data = await response.json();
      console.log("Clientes:", data);
      setListaDeClientes(Array.isArray(data) ? data : data.list || []);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
    }
  };




  // Helper para obter nome do serviço a partir do catálogo
  const getNomeDoServico = (servico: Service) =>
    catalagoDeSERVICOS.find((c) => c.id === servico.servicoConfigId)?.nome || servico.tipoDoServico;

  const getTipoDeServico = (servico: Service) => {
    return catalagoDeSERVICOS.find(
      c => String(c.id) === String(servico.servicoConfigId)
    )?.tipo || null;
  };


  return (
    <div className={styles.container}>
      {/* FILTROS */}
      <div className={styles.filtros}>
        <input type="text" placeholder="Filtrar por tipo de serviço" value={filtroServico} onChange={(e) => setFiltroServico(e.target.value)} />
        <input type="text" placeholder="Filtrar por colaborador" value={filtroColaborador} onChange={(e) => setFiltroColaborador(e.target.value)} />
        <input type="date" value={filtroData} onChange={(e) => setFiltroData(e.target.value)} />


      </div>
      <div className={styles.containerTitle}>
        <h2 className={styles.title}>Controle de Serviços</h2>
        <div className={styles.actions}>
          <button className={styles.primaryBtn} onClick={() => setMostrarFormulario(true)}>Adicionar Serviço</button>
        </div>
      </div>
      {/* FORMULÁRIO */}
      {mostrarFormulario && (
        <form className={`${styles.form} ${styles.formCompact}`} onSubmit={handleSubmit}>
          <select name="servicoConfigId" value={formData.servicoConfigId || ""} onChange={handleChange} required>
            <option value="">Selecione um serviço</option>
            {catalagoDeSERVICOS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>

          <select name="clienteId" value={formData.clienteId} onChange={handleChange}>
            <option value="" >Selecione cliente</option>
            {listaDeClientes.map((c) => (
              <option key={c.id} value={c.id}>
                {`${c.nome} ${c.sobrenome}`}
              </option>
            ))}

          </select>
          <input type="number" name="valorDoServico" placeholder="Valor do Serviço" value={formData.valorDoServico} onChange={handleChange} required />
          <select name="colaboradorId" value={formData.colaboradorId || ""} onChange={handleChange} required>
            <option value="">Selecione um colaborador</option>
            {colaboradores.map((c) => <option key={c.id} value={c.id}>{c.nomeCompleto}</option>)}
          </select>
          <input type="date" name="data" value={formData.data} onChange={handleChange} required />
          <input type="time" name="hora" value={formData.hora} onChange={handleChange} required />
          <div className={styles.formBtns}>
            <button type="submit" className={styles.primaryBtn}>Registrar Serviço</button>
            <button type="button" className={styles.secondaryBtn} onClick={() => setMostrarFormulario(false)}>Fechar</button>
          </div>
        </form>
      )}

      {/* TABELA */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Serviço</th>
            <th>Valor</th>
            <th>Colaborador</th>
            <th>Cliente</th>
            <th>Data e Hora</th>
            <th>Tipo de serviço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {servicosFiltrados.length > 0 ? (
            servicosFiltrados.map((servico) => (
              <tr key={servico.id}>
                <td>{getNomeDoServico(servico)}</td>
                <td>{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(servico.valorDoServico)}</td>
                <td>{servico.colaborador?.nomeCompleto || ""}</td>
                <td>
                  {listaDeClientes.find(c => c.id === servico.clienteId)?.nome || ""}{" "}
                  {listaDeClientes.find(c => c.id === servico.clienteId)?.sobrenome || ""}
                </td>
                <td>{new Date(servico.data).toLocaleDateString("pt-BR")} - {servico.hora.slice(0, 5)}</td>
                <td>
                  <td>{getTipoDeServico(servico) || "-"}</td>

                </td>

                <td>
                  <button className={styles.deleteBtn} onClick={() => deleteService(servico.id)}>Deletar</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>Nenhum serviço encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
