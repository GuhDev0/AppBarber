"use client";
import { useState } from "react";
import AdicionarServico from "./adicionarServico/page";
import EditarEmpresa from "./editarEmpresa/[id]/page";
import HorariosEdias from "./horariosEdias/page";
import styles from "./styles.module.css";

export default function ConfiguracaoDaBarbearia() {
    const [activeTab, setActiveTab] = useState<"servico" | "empresa" | "horarios">("empresa");

    return (
        <div className={styles.cabecalho_configuracaoDaBarbearia}>
            <h2>Configurações da Barbearia</h2>
            <p>Personalize os dados, horários e serviços da sua barbearia</p>
            <div className={styles.containerConfiguracao}>
                
                <div className={styles.containerListConfiguracao}>
                    <button 
                        className={activeTab === "empresa" ? styles.active : ""}
                        onClick={() => setActiveTab("empresa")}
                    >
                        Dados da Empresa
                    </button>
                    <button 
                        className={activeTab === "horarios" ? styles.active : ""}
                        onClick={() => setActiveTab("horarios")}
                    >
                        Horários & Dias
                    </button>
                    <button 
                        className={activeTab === "servico" ? styles.active : ""}
                        onClick={() => setActiveTab("servico")}
                    >
                        Catálogo de Serviços
                    </button>
                </div>
                <div className={styles.contentArea}>
                    {activeTab === "empresa" && <EditarEmpresa />}
                    {activeTab === "horarios" && <HorariosEdias />}
                    {activeTab === "servico" && <AdicionarServico />}
                </div>

            </div>


        </div>
    );
}
