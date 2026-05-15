import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { api } from "@/app/lib/api";
import moment from "moment";

type Props = {
    event: any;
    onClose: () => void;
};

interface Colaborador {
    id: number;
    nomeCompleto: string;
}

interface Servico {
    id: number;
    nome: string;
    preco: number;
}
interface listaDeClientes {
    id: number;
    nome: string;
    Sobrenome: string;
    email: string;
    tel: string;
}

const ModalAtividade = ({ event, onClose }: Props) => {

    const [colaboradorId, setColaboradorId] = useState("");
    const [servicoId, setServicoId] = useState("");
    const [listaDeServicos, setListaDeServicos] = useState<Servico[]>([]);
    const [listaColaboradores, setListaColaboradores] = useState<Colaborador[]>([]);
    const [listaDeClientes, setListaDeClientes] = useState<listaDeClientes[]>([]);
    const [clienteId, setClienteId] = useState("");


    const formatDate = (date: Date): string => {
        return moment(date).format("YYYY-MM-DDTHH:mm:ss");
    };


    const buscarListaDeClientes = async () => {

        try {
            const response = await api.get('/cliente/listaDeClientes')
            setListaDeClientes(response.data)
        } catch (error: any) {
            console.log(error.message)
        }
    }
    const buscarListaColaboradores = () => {
        api.get("/colaborador/listaDeColaboradores")
            .then((response) => {
                setListaColaboradores(response.data);
            })
            .catch((error) => {
                console.error(
                    "Erro ao buscar colaboradores:",
                    error
                );
            });
    };
    const listaDeCatalagoDeServicos = async () => {
        try {
            const response = await api.get(`/configuracao/catalago`)
            setListaDeServicos(response.data)
        } catch (error: any) {
            console.log(error.message)
        }
    }

    const handleSubmit = async () => {
        try {
            const novoEvento = {
                colaboradorId: Number(colaboradorId),
                servicoConfigId: Number(servicoId),
                clienteId: Number(clienteId),
                startTime: formatDate(event.start),
                endTime: formatDate(event.end),
            };
            console.log(novoEvento)
            await api.post("/agendamento", novoEvento);

            onClose();

        } catch (error: any) {
            console.log(error.response.data);
        }
    };

    useEffect(() => {
        buscarListaColaboradores();
        listaDeCatalagoDeServicos();
        buscarListaDeClientes();
    }, []);

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>

                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        novo Agendamento
                    </h2>

                    <button onClick={onClose}>
                        ✕
                    </button>
                </div>


                <div className={styles.field}>
                    <label>Início</label>

                    <input
                        type="text"
                        value={new Date(
                            event.start
                        ).toLocaleString("pt-BR")}
                        readOnly
                    />
                </div>
                <div className={styles.field}>
                    <label>Fim</label>

                    <input
                        type="text"
                        value={new Date(
                            event.end
                        ).toLocaleString("pt-BR")}
                        readOnly
                    />
                </div>



                <div className={styles.field}>
                    <label>Colaborador</label>

                    <select
                        value={colaboradorId}
                        onChange={(e) =>
                            setColaboradorId(e.target.value)
                        }
                    >
                        <option value="">
                            Selecione um colaborador
                        </option>

                        {listaColaboradores.map(
                            (colaborador) => (
                                <option
                                    key={colaborador.id}
                                    value={colaborador.id}
                                >
                                    {colaborador.nomeCompleto}
                                </option>
                            )
                        )}
                    </select>
                </div>


                <div className={styles.field}>
                    <label>Cliente</label>
                    <select
                        value={clienteId}
                        onChange={(e) => setClienteId(e.target.value)}
                    >
                        <option value="">
                            Selecione um cliente
                        </option>
                        {listaDeClientes.map((cliente) => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nome} {cliente.Sobrenome}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.field}>
                    <label>Serviço</label>
                    <select
                        value={servicoId}
                        onChange={(e) => setServicoId(e.target.value)}
                    >
                        <option value="">
                            Selecione um serviço
                        </option>
                        {listaDeServicos.map((servico) => (
                            <option key={servico.id} value={servico.id}>
                                {servico.nome}  - R${servico.preco.toFixed(2)}
                            </option>
                        ))}
                    </select>
                </div>


                <div className={styles.actions}>
                    <button
                        className={styles.cancelButton}
                        onClick={onClose}
                    >
                        Cancelar
                    </button>

                    <button
                        className={styles.saveButton}
                        onClick={handleSubmit}
                    >
                        Salvar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalAtividade;