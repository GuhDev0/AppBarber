"use client";

import { useEffect, useState } from "react";
import Calendario from "@/app/components/Calendario-bg/calendario";
import styles from "./styles.module.css";
import ModalAgendamento from "./agendamento";
import { api } from "@/app/lib/api";
import { IoSearchOutline, IoFilterOutline, IoAddOutline, IoRefreshOutline, IoCalendarOutline, IoListOutline, IoStarOutline, IoAlarmOutline } from "react-icons/io5";

interface Colaborador {
  id: number;
  nomeCompleto: string;
}

interface Agendamento {
  id: number;
  start: string;
  end: string;
  status?: string;
  Cliente?: {
    nome?: string;
    sobrenome?: string;
  };
  Colaborador?: Colaborador;
  ServicoConfig?: {
    tipo?: string;
    nome?: string;
  };
  colaboradorId?: number;
}

const TABS = [
  { label: "Todos", icon: <IoCalendarOutline /> },
  { label: "Eventos", icon: <IoStarOutline /> },
  { label: "Reuniões", icon: <IoListOutline /> },
  { label: "Lembretes", icon: <IoAlarmOutline /> },
];

export default function Agendamento() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listaDeColaboradores, setListaDeColaboradores] = useState<Colaborador[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [filtroColaborador, setFiltroColaborador] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");

  const fetchColaboradores = async () => {
    try {
      const response = await api.get<Colaborador[]>("/colaborador/listaDeColaboradores");
      setListaDeColaboradores(response.data || []);
    } catch (err: any) {
      setError("Erro ao buscar colaboradores.");
      console.error(err);
    }
  };

  const fetchAgendamentos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Agendamento[]>("/agendamento");
      setAgendamentos(response.data || []);
    } catch (err: any) {
      setError("Erro ao carregar agendamentos.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColaboradores();
    fetchAgendamentos();
  }, []);

  const filteredAgendamentos = agendamentos
    .filter(
      (a) =>
        filtroColaborador === 0 ||
        a.Colaborador?.id === filtroColaborador ||
        a.colaboradorId === filtroColaborador
    )
    .filter((a) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        a.Colaborador?.nomeCompleto?.toLowerCase().includes(s) ||
        a.Cliente?.nome?.toLowerCase().includes(s) ||
        a.Cliente?.sobrenome?.toLowerCase().includes(s) ||
        a.ServicoConfig?.tipo?.toLowerCase().includes(s) ||
        a.ServicoConfig?.nome?.toLowerCase().includes(s)
      );
    });

  const calendarEvents = filteredAgendamentos.map((agendamento) => ({
    id: agendamento.id,
    title: `${agendamento.ServicoConfig?.tipo || agendamento.ServicoConfig?.nome || "Agendamento"} - ${agendamento.Colaborador?.nomeCompleto || "Sem colaborador"}`,
    start: new Date(agendamento.start),
    end: new Date(agendamento.end),
  }));



  return (
    <div className={styles.container}>
      {/* BREADCRUMB */}
      <div className={styles.pageHeader}>
        <p className={styles.breadcrumb}>Dashboard / <span>Calendário</span></p>
        <div className={styles.headerActions}>
          <button className={styles.secondaryBtn} onClick={fetchAgendamentos}>
            <IoRefreshOutline />
            Atualizar
          </button>
          <button className={styles.primaryBtn} onClick={() => setIsModalOpen(true)}>
            <IoAddOutline />
            Novo
          </button>
        </div>
      </div>


      {/* CALENDÁRIO */}
      <div className={styles.calendarWrapper}>
        <div>
          <div className={styles.colaboradorFilter}>
              <div>
                <label htmlFor="colaborador">Colaborador:</label>
                <select
                  id="colaborador"
                  value={filtroColaborador}
                  onChange={(e) => setFiltroColaborador(Number(e.target.value))}
                >
                  <option value={0}>Todos</option>
                  {listaDeColaboradores.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.nomeCompleto}
                    </option>
                  ))}
                </select>
              </div>
          </div>
        </div>
        <Calendario events={calendarEvents} />
      </div>



      {isModalOpen && (
        <ModalAgendamento
          onClose={() => setIsModalOpen(false)}
          onCreateSuccess={() => {
            fetchAgendamentos();
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
