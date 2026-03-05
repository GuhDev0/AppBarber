"use client";
import { useState } from "react";
import AdicionarServico from "./adicionarServico/page";
import styles from "./styles.module.css";

export default function ConfiguracaoDaBarbearia() {
    const [mostrarAdicionarServico, setMostrarAdicionarServico] = useState(false);

    return (
        <div className={styles.cabecalho_configuracaoDaBarbearia}>
            <h2>Configurações da Barbearia</h2>
                    <p>Personalize os serviços, comissões e categorias da sua barbearia</p>
            <div className={styles.containerConfiguracao}>
                
                <div className={styles.containerListConfiguracao}>
                    <button onClick={() => setMostrarAdicionarServico(!mostrarAdicionarServico)}>
                        Área de serviço
                    </button>
                    <button>
                        perfil
                    </button>
                </div>
                <div>
                    {mostrarAdicionarServico && <AdicionarServico />}
                </div>

            </div>


        </div>
    );
}
