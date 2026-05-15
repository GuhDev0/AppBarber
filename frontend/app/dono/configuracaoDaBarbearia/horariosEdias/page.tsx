"use client";
import { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { IoCheckmark, IoCloseSharp, IoTrash } from "react-icons/io5";
import { api } from "@/app/lib/api";

interface Horario {
  id: number;
  diaSemana: string[];
  start: string;
  end: string;
  colaboradorId?: number;
}

const DIAS_SEMANA = ["SEGUNDA", "TERCA", "QUARTA", "QUINTA", "SEXTA", "SABADO", "DOMINGO"];

export default function HorariosEdias() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [tipoHorario, setTipoHorario] = useState<"empresa" | "colaborador">("empresa");
  const [diasSelecionados, setDiasSelecionados] = useState<string[]>([]);
  const [horarioInicio, setHorarioInicio] = useState("09:00");
  const [horarioFim, setHorarioFim] = useState("17:00");
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  useEffect(() => {
    fetchHorarios();
    fetchColaboradores();
  }, []);

  const fetchHorarios = async () => {
    try {
      setLoading(true);
      const response = await api.get("/horario/listar");
      setHorarios(response.data);
    } catch (error: any) {
      setMessage({ type: "error", text: "Erro ao carregar horários" });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchColaboradores = async () => {
    try {
      const response = await api.get("/colaborador/listaDeColaboradores");
      setColaboradores(response.data);
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleDiaChange = (dia: string) => {
    setDiasSelecionados((prev) =>
      prev.includes(dia) ? prev.filter((d) => d !== dia) : [...prev, dia]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (diasSelecionados.length === 0) {
      setMessage({ type: "error", text: "Selecione pelo menos um dia da semana" });
      return;
    }

    try {
      setSaving(true);
      const novoHorario = {
        diaSemana: diasSelecionados,
        start: horarioInicio,
        end: horarioFim,
        colaboradorId: tipoHorario === "colaborador" ? parseInt(colaboradorSelecionado) : null,
      };

      await api.post("/horario/criar", novoHorario);
      fetchHorarios();
      setShowForm(false);
      resetForm();
      setMessage({ type: "success", text: "Horário criado com sucesso!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: "error", text: "Erro ao criar horário" });
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja deletar este horário?")) return;

    try {
      await api.delete(`/horario/${id}`);
      fetchHorarios();
      setMessage({ type: "success", text: "Horário deletado com sucesso!" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: "error", text: "Erro ao deletar horário" });
      console.error(error);
    }
  };

  const resetForm = () => {
    setDiasSelecionados([]);
    setHorarioInicio("09:00");
    setHorarioFim("17:00");
    setTipoHorario("empresa");
    setColaboradorSelecionado("");
  };

  if (loading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  const horariosEmpresa = horarios.filter((h) => !h.colaboradorId);
  const horariosColaborador = horarios.filter((h) => h.colaboradorId);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>Horários e Dias da Semana</h3>
        <button className={styles.btnAdd} onClick={() => setShowForm(true)}>
          + Adicionar Horário
        </button>
      </div>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>Tipo de Horário</label>
              <div className={styles.radioGroup}>
                <label>
                  <input
                    type="radio"
                    value="empresa"
                    checked={tipoHorario === "empresa"}
                    onChange={(e) => setTipoHorario(e.target.value as "empresa" | "colaborador")}
                  />
                  Geral (Empresa)
                </label>
                <label>
                  <input
                    type="radio"
                    value="colaborador"
                    checked={tipoHorario === "colaborador"}
                    onChange={(e) => setTipoHorario(e.target.value as "empresa" | "colaborador")}
                  />
                  Específico (Colaborador)
                </label>
              </div>
            </div>

            {tipoHorario === "colaborador" && (
              <div className={styles.formGroup}>
                <label>Selecionar Colaborador</label>
                <select
                  value={colaboradorSelecionado}
                  onChange={(e) => setColaboradorSelecionado(e.target.value)}
                  required
                >
                  <option value="">-- Escolha um colaborador --</option>
                  {colaboradores.map((col) => (
                    <option key={col.id} value={col.id}>
                      {col.nomeCompleto}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className={styles.formGroup}>
              <label>Dias da Semana</label>
              <div className={styles.diasContainer}>
                {DIAS_SEMANA.map((dia) => (
                  <label key={dia} className={styles.diaCheckbox}>
                    <input
                      type="checkbox"
                      checked={diasSelecionados.includes(dia)}
                      onChange={() => handleDiaChange(dia)}
                    />
                    <span>{dia.substring(0, 3)}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.horariosRow}>
              <div className={styles.formGroup}>
                <label>Horário de Início</label>
                <input
                  type="time"
                  value={horarioInicio}
                  onChange={(e) => setHorarioInicio(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Horário de Término</label>
                <input
                  type="time"
                  value={horarioFim}
                  onChange={(e) => setHorarioFim(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" disabled={saving} className={styles.btnSave}>
                <IoCheckmark /> {saving ? "Salvando..." : "Salvar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className={styles.btnCancel}
              >
                <IoCloseSharp /> Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className={styles.horariosSection}>
        <h4>Horários Gerais da Empresa</h4>
        {horariosEmpresa.length > 0 ? (
          <div className={styles.horariosList}>
            {horariosEmpresa.map((horario) => (
              <div key={horario.id} className={styles.horarioCard}>
                <div className={styles.horarioInfo}>
                  <div className={styles.diasInfo}>
                    <strong>Dias:</strong> {horario.diaSemana.join(", ")}
                  </div>
                  <div className={styles.timeInfo}>
                    <strong>Horário:</strong> {horario.start} às {horario.end}
                  </div>
                </div>
                <button
                  className={styles.btnDelete}
                  onClick={() => handleDelete(horario.id)}
                  title="Deletar"
                >
                  <IoTrash />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noData}>Nenhum horário geral configurado</p>
        )}
      </div>

      {horariosColaborador.length > 0 && (
        <div className={styles.horariosSection}>
          <h4>Horários por Colaborador</h4>
          <div className={styles.horariosList}>
            {horariosColaborador.map((horario) => {
              const colaborador = colaboradores.find((c) => c.id === horario.colaboradorId);
              return (
                <div key={horario.id} className={styles.horarioCard}>
                  <div className={styles.horarioInfo}>
                    <div className={styles.colaboradorInfo}>
                      <strong>Colaborador:</strong> {colaborador?.nomeCompleto || "N/A"}
                    </div>
                    <div className={styles.diasInfo}>
                      <strong>Dias:</strong> {horario.diaSemana.join(", ")}
                    </div>
                    <div className={styles.timeInfo}>
                      <strong>Horário:</strong> {horario.start} às {horario.end}
                    </div>
                  </div>
                  <button
                    className={styles.btnDelete}
                    onClick={() => handleDelete(horario.id)}
                    title="Deletar"
                  >
                    <IoTrash />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
