import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { IoCloseSharp, IoCheckmark } from "react-icons/io5";
import { api } from "@/app/lib/api";

type Props = {
  onClose: () => void;
  onCreateSuccess?: () => void;
};

interface Colaborador {
  id: number;
  nomeCompleto: string;
}

interface Horario {
  start: string;
  end: string;
}

interface Cliente {
  id: number;
  nome?: string;
  sobrenome?: string;
}

interface Servico {
  id: number;
  tipo?: string;
  nome?: string;
}

const STEPS = ["Colaborador", "Cliente & Serviço", "Horário", "Confirmar"];

const ModalAgendamento = ({ onClose, onCreateSuccess }: Props) => {
  const [step, setStep] = useState(1);
  const [colaboradorSelecionado, setColaboradorSelecionado] = useState<number | null>(null);
  const [listaDeColaboradores, setListaDeColaboradores] = useState<Colaborador[]>([]);
  const [listaDeHorarios, setListaDeHorarios] = useState<Horario[]>([]);
  const [listaDeClientes, setListaDeClientes] = useState<Cliente[]>([]);
  const [listaDeServicos, setListaDeServicos] = useState<Servico[]>([]);
  const [clienteSelecionado, setClienteSelecionado] = useState<number | null>(null);
  const [servicoSelecionado, setServicoSelecionado] = useState<number | null>(null);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchColaboradores = async () => {
    try {
      const response = await api.get<Colaborador[]>("/colaborador/listaDeColaboradores");
      setListaDeColaboradores(response.data || []);
    } catch (error: any) {
      console.log("Erro ao buscar colaboradores", error.message);
    }
  };

  const fetchClientes = async () => {
    try {
      const response = await api.get<Cliente[]>("/cliente/listaDeClientes");
      setListaDeClientes(response.data || []);
    } catch (error: any) {
      console.log("Erro ao buscar clientes", error.message);
    }
  };

  const fetchServicos = async () => {
    try {
      const response = await api.get<Servico[]>("/configuracao/catalago");
      setListaDeServicos(response.data || []);
    } catch (error: any) {
      console.log("Erro ao buscar serviços", error.message);
    }
  };

  const fetchHorarios = async (Id: number) => {
    try {
      const response = await api.get<Horario[]>(`/horario/listaDeHorarioDeColaborador/${Id}`);
      setListaDeHorarios(response.data || []);
    } catch (error: any) {
      console.log("Erro ao buscar horários", error.message);
    }
  };

  useEffect(() => {
    fetchColaboradores();
    fetchClientes();
    fetchServicos();
  }, []);

  useEffect(() => {
    if (colaboradorSelecionado) {
      fetchHorarios(colaboradorSelecionado);
    } else {
      setListaDeHorarios([]);
      setHorarioSelecionado("");
    }
  }, [colaboradorSelecionado]);

  const handleNext = () => {
    if (step === 1 && !colaboradorSelecionado) return;
    if (step === 2 && (!clienteSelecionado || !servicoSelecionado)) return;
    if (step === 3 && !horarioSelecionado) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step === 1) return;
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!colaboradorSelecionado || !clienteSelecionado || !servicoSelecionado || !horarioSelecionado) {
      setSubmitError("Selecione todos os dados para continuar.");
      return;
    }

    const horario = JSON.parse(horarioSelecionado) as Horario;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await api.post("/agendamento", {
        startTime: horario.start,
        endTime: horario.end,
        clienteId: clienteSelecionado,
        colaboradorId: colaboradorSelecionado,
        servicoConfigId: servicoSelecionado,
      });
      onCreateSuccess?.();
    } catch (error: any) {
      setSubmitError(
        error?.response?.data?.mensagem || error.message || "Erro ao criar agendamento"
      );
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Novo Agendamento</h2>
          <button onClick={onClose}>
            <IoCloseSharp />
          </button>
        </div>

        {/* STEP INDICATOR */}
        <div className={styles.stepIndicator}>
          {STEPS.map((label, i) => {
            const num = i + 1;
            const isDone = step > num;
            const isActive = step === num;
            return (
              <>
                <div
                  key={`dot-${i}`}
                  className={`${styles.stepDot} ${isActive ? styles.stepDotActive : ""} ${isDone ? styles.stepDotDone : ""}`}
                  title={label}
                >
                  {isDone ? <IoCheckmark size={12} /> : num}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    key={`line-${i}`}
                    className={`${styles.stepLine} ${step > num ? styles.stepLineDone : ""}`}
                  />
                )}
              </>
            );
          })}
        </div>

        {/* STEP LABEL */}
        <p style={{ fontSize: "0.8rem", color: "#6b7280", marginBottom: "16px", marginTop: "-8px" }}>
          Passo {step} de {STEPS.length} — <strong style={{ color: "#374151" }}>{STEPS[step - 1]}</strong>
        </p>

        {/* STEP 1 */}
        {step === 1 && (
          <div className={styles.formGroup}>
            <div>
              <label>Colaborador</label>
              <select
                value={colaboradorSelecionado ?? ""}
                onChange={(e) =>
                  setColaboradorSelecionado(e.target.value ? Number(e.target.value) : null)
                }
              >
                <option value="">Selecione o colaborador</option>
                {listaDeColaboradores.map((colaborador) => (
                  <option key={colaborador.id} value={colaborador.id}>
                    {colaborador.nomeCompleto}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className={styles.formGroup}>
            <div>
              <label>Cliente</label>
              <select
                value={clienteSelecionado ?? ""}
                onChange={(e) =>
                  setClienteSelecionado(e.target.value ? Number(e.target.value) : null)
                }
              >
                <option value="">Selecione o cliente</option>
                {listaDeClientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome || ""} {cliente.sobrenome || ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label>Serviço</label>
              <select
                value={servicoSelecionado ?? ""}
                onChange={(e) =>
                  setServicoSelecionado(e.target.value ? Number(e.target.value) : null)
                }
              >
                <option value="">Selecione o serviço</option>
                {listaDeServicos.map((servico) => (
                  <option key={servico.id} value={servico.id}>
                    {servico.tipo || servico.nome || `Serviço ${servico.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className={styles.formGroup}>
            <div>
              <label>Horário disponível</label>
              {listaDeHorarios.length === 0 ? (
                <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                  Nenhum horário disponível para este colaborador.
                </p>
              ) : (
                <select
                  value={horarioSelecionado}
                  onChange={(e) => setHorarioSelecionado(e.target.value)}
                >
                  <option value="">Selecione o horário</option>
                  {listaDeHorarios.map((horario, index) => (
                    <option key={index} value={JSON.stringify(horario)}>
                      {new Date(horario.start).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {new Date(horario.end).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        )}

        {/* STEP 4 - RESUMO */}
        {step === 4 && (
          <div className={styles.summaryBox}>
            <p>
              <strong>Colaborador:</strong>
              {listaDeColaboradores.find((item) => item.id === colaboradorSelecionado)?.nomeCompleto}
            </p>
            <p>
              <strong>Cliente:</strong>
              {`${listaDeClientes.find((item) => item.id === clienteSelecionado)?.nome || ""} ${listaDeClientes.find((item) => item.id === clienteSelecionado)?.sobrenome || ""}`.trim()}
            </p>
            <p>
              <strong>Serviço:</strong>
              {listaDeServicos.find((item) => item.id === servicoSelecionado)?.tipo ||
                listaDeServicos.find((item) => item.id === servicoSelecionado)?.nome}
            </p>
            <p>
              <strong>Horário:</strong>
              {horarioSelecionado
                ? `${new Date(JSON.parse(horarioSelecionado).start).toLocaleString("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })} - ${new Date(JSON.parse(horarioSelecionado).end).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}`
                : "Não selecionado"}
            </p>
          </div>
        )}

        {submitError && <p className={styles.errorText}>{submitError}</p>}

        {/* ACTIONS */}
        <div className={styles.modalActions}>
          <button
            className={styles.modalBtnSecondary}
            onClick={handleBack}
            disabled={step === 1 || isSubmitting}
          >
            Voltar
          </button>

          {step < 4 ? (
            <button className={styles.modalBtnPrimary} onClick={handleNext}>
              Próximo →
            </button>
          ) : (
            <button
              className={styles.modalBtnPrimary}
              onClick={handleSubmit}
              disabled={isSubmitting || !horarioSelecionado}
            >
              {isSubmitting ? "Salvando..." : "Confirmar agendamento"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalAgendamento;
