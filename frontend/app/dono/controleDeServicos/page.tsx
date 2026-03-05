"use client";

import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { api } from "@/app/lib/api";
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
  const [listaDeColaboradores, setListaDeColaboradores] = useState<Colaborador[]>([]);
  const [catalagoDeSERVICOS, setCatalagoDeSERVICOS] = useState<ListaDeServico[]>([]);
  const [listaDeClientes, setListaDeClientes] = useState<listaDeClientes[]>([]);
  
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



 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await api.post<Service>(
      "/servicos/registraServico",
      formData
    );

    const novoServico = response.data;

    
    setServicos((prev) => [novoServico, ...prev]);

    await listaDeServicos();
    setFormData({
      tipoDoServico: "",
      valorDoServico: 0,
      colaboradorId: 0,
      data: formatDateForInput(new Date()),
      hora: formatTimeForInput(new Date()),
      servicoConfigId: 0,
      clienteId: 0,
    });

  } catch (error: any) {
    console.error("Erro ao registrar serviço:", error.message);
    alert("Erro ao registrar serviço");
  }
};

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


  /*AREA DE SERVIÇOS*/

  const listaDeServicos = async () => {
  try {
    const response = await api.get("/servicos/listaDeServico"); 
    
    setServicos(response.data);

  } catch (error: any) {
    console.error("Erro ao buscar serviços:", error.message);
  }
};

 const deleteService = async (id: number) => {
  try {
    
    await api.delete(`/servicos/deleteDeServico/${id}`);
    await listaDeServicos(); 
  } catch (error) {
    console.error("Erro ao deletar:", error);
  }
};


 /*AREA DE CATALAGO DE SERVIÇO*/ 
 
const listaDeCatalago = async () =>{
  try{
    const response = await api.get(`/catalagoDeServicos/catalago`)
     setCatalagoDeSERVICOS(response.data)
  }catch(error:any){
    console.log(error.message)
  }
}

/* LISTA DE CLIENTES*/
const buscarListaDeClientes = async () =>{
  
  try{
  const response = await api.get('/cliente/listaDeClientes')
  setListaDeClientes(response.data)  
  }catch(error:any){
    console.log(error.message)
  }
}


/* LISTA DE COLABORADOR*/

const buscarListaDeColaboradores = async () =>{
   try{
  const response = await api.get('/colaborador/listaDeColaboradores')
  console.log(response.data)
  setListaDeColaboradores(response.data)
  }catch(error:any){
    console.log(error.message)
  }
}

  const servicosFiltrados = servicos.filter((s) => {
    const tipoOk = s.tipoDoServico.toLowerCase().includes(filtroServico.toLowerCase());
    const colaboradorOk = s.colaborador?.nomeCompleto.toLowerCase().includes(filtroColaborador.toLowerCase()) ?? false;
    const dataOk = filtroData ? s.data.startsWith(filtroData) : true;
    return tipoOk && colaboradorOk && dataOk;
  });

  const getNomeDoServico = (servico: Service) =>
    catalagoDeSERVICOS.find((c) => c.id === servico.servicoConfigId)?.nome || servico.tipoDoServico;

  const getTipoDeServico = (servico: Service) => {
    return catalagoDeSERVICOS.find((c) => String(c.id) === String(servico.servicoConfigId))?.tipo || "-";
  };


  useEffect(() => {
    listaDeServicos()
    buscarListaDeClientes()
    listaDeCatalago()
    buscarListaDeColaboradores()
  }, []);

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
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </select>

          <select name="clienteId" value={formData.clienteId} onChange={handleChange}>
            <option value="">Selecione cliente</option>
            {listaDeClientes.map((c) => (
              <option key={c.id} value={c.id}>{`${c.nome} ${c.sobrenome}`}</option>
            ))}
          </select>

          <input type="number" name="valorDoServico" placeholder="Valor do Serviço" value={formData.valorDoServico} onChange={handleChange} required />

          <select name="colaboradorId" value={formData.colaboradorId || ""} onChange={handleChange}>
            <option value="">Seleciona o colaborador</option>
            {listaDeColaboradores.map((c) => <option key={c.id} value={c.id}>{c.nomeCompleto}</option>)}
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
            servicosFiltrados.sort((a, b) => b.data.localeCompare(a.data)).map((servico) => (
              <tr key={servico.id}>
                <td>{getNomeDoServico(servico)}</td>
                <td>{Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(servico.valorDoServico)}</td>
                <td>{servico.colaborador?.nomeCompleto || ""}</td>
                <td>{listaDeClientes.find(c => c.id === servico.clienteId)?.nome || ""}{" "}{listaDeClientes.find(c => c.id === servico.clienteId)?.sobrenome || ""}</td>
                <td>
                  {servico.data.split("T")[0].split("-").reverse().join("/")}

                </td>
                <td>{getTipoDeServico(servico)}</td>
                <td><button className={styles.deleteBtn} onClick={() => deleteService(Number(servico.id))}>Deletar</button></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} style={{ textAlign: "center" }}>Nenhum serviço encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
